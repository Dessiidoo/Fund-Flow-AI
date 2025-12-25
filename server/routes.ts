import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerAuthRoutes, setupAuth } from "./replit_integrations/auth";

import { registerImageRoutes } from "./replit_integrations/image";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { InsertInvestor } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth & Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // --- SEEDING FUNCTION ---
  async function seedInvestors() {
    const existing = await storage.getInvestors();
    if (existing.length > 0) return; // Already seeded

    const csvPath = path.join(process.cwd(), "attached_assets", "Fund_Database-Angel_Investors_1766572251362.csv");
    if (!fs.existsSync(csvPath)) {
      console.warn("CSV file not found, skipping seed.");
      return;
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }, async (err, records) => {
      if (err) {
        console.error("CSV Parse error:", err);
        return;
      }

      const investorsToInsert: InsertInvestor[] = [];
      
      for (const record of records) {
        // Map CSV columns to schema
        investorsToInsert.push({
          name: record['Investor Name'] || 'Unknown',
          fundType: record['Fund Type'],
          website: record['Website (if available)'],
          focus: record['Fund Focus (Sectors)'],
          stage: record['Fund Stage'],
          partnerName: record['Partner Name'],
          partnerEmail: record['Partner Email'],
          portfolio: record['Portfolio Companies'],
          location: record['Location'],
          socialLinks: {
            twitter: record['Twitter Link'],
            linkedin: record['LinkedIn Link'],
            facebook: record['Facebook Link']
          },
          investmentCount: parseInt(record['Number of Investments']) || 0,
          exitCount: parseInt(record['Number of Exits']) || 0,
          description: record['Fund Description'],
          foundingYear: parseInt(record['Founding Year']) || null,
        });
      }

      // Batch insert in chunks of 100 to avoid limits
      const chunkSize = 100;
      for (let i = 0; i < investorsToInsert.length; i += chunkSize) {
        const chunk = investorsToInsert.slice(i, i + chunkSize);
        await storage.createInvestors(chunk);
      }
      console.log(`Seeded ${investorsToInsert.length} investors.`);
    });
  }

  // Trigger seed on startup (async)
  seedInvestors();

  // --- INVESTORS API ---
  app.get(api.investors.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const focus = req.query.focus as string | undefined;
    const investors = await storage.getInvestors(search, focus);
    res.json(investors);
  });

  app.get(api.investors.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const investor = await storage.getInvestor(id);
    if (!investor) return res.status(404).json({ message: "Investor not found" });
    res.json(investor);
  });

  // --- CAMPAIGNS API ---
  app.get(api.campaigns.list.path, async (req, res) => {
    const campaigns = await storage.getCampaigns();
    res.json(campaigns);
  });

  app.post(api.campaigns.create.path, async (req, res) => {
    try {
      const input = api.campaigns.create.input.parse(req.body);
      const campaign = await storage.createCampaign(input);
      res.status(201).json(campaign);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.campaigns.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const campaign = await storage.getCampaign(id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.json(campaign);
  });

  app.get(api.campaigns.getMatches.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const matches = await storage.getMatches(id);
    res.json(matches);
  });

  // --- AI MATCHING & EMAIL GENERATION ---
  
  app.post(api.campaigns.generateMatches.path, async (req, res) => {
    const campaignId = parseInt(req.params.id);
    const campaign = await storage.getCampaign(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // 1. Get all investors (or a subset for MVP efficiency)
    const allInvestors = await storage.getInvestors();
    // 2. Simple keyword matching first to reduce LLM load (optional optimization)
    // For now, we'll send batches to OpenAI to score relevance.
    
    // NOTE: In a real prod app, you'd use embeddings. 
    // Here we'll take top 20 investors that loosely match keywords or just first 20 for demo if no keywords match.
    // Let's do a basic filter first.
    const relevantInvestors = allInvestors.filter(inv => {
      if (!campaign.description) return true;
      const desc = campaign.description.toLowerCase();
      return (inv.focus && inv.focus.toLowerCase().split(',').some(f => desc.includes(f.trim()))) ||
             (inv.stage && desc.includes(inv.stage.toLowerCase()));
    }).slice(0, 20); // Limit to 20 for rate limits

    let matchCount = 0;

    for (const investor of relevantInvestors) {
      // AI Scoring
      try {
        const prompt = `
          Analyze the fit between this campaign and investor.
          Campaign: "${campaign.name}" - ${campaign.description}
          Investor: "${investor.name}" - Focus: ${investor.focus}, Stage: ${investor.stage}, Portfolio: ${investor.portfolio}
          
          Return JSON: { "score": number (0-100), "reason": "short explanation" }
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");
        
        if (result.score > 50) {
          await storage.createMatch({
            campaignId,
            investorId: investor.id,
            matchScore: result.score,
            matchReason: result.reason,
            status: "pending",
            emailStatus: "not_sent"
          });
          matchCount++;
        }
      } catch (e) {
        console.error("Error matching investor:", investor.name, e);
      }
    }

    res.json({ count: matchCount });
  });

  app.post(api.matches.generateEmail.path, async (req, res) => {
    const matchId = parseInt(req.params.id);
    const match = await storage.getMatch(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const campaign = await storage.getCampaign(match.campaignId);
    const investor = await storage.getInvestor(match.investorId);

    if (!campaign || !investor) return res.status(404).json({ message: "Data missing" });

    try {
      const prompt = `
        Write a personalized cold email from the founder of "${campaign.name}" to investor "${investor.name}".
        Campaign Details: ${campaign.description}
        Investor Focus: ${investor.focus}
        Investor Portfolio: ${investor.portfolio}
        
        Keep it concise, professional, and mention why they are a good fit based on their portfolio/focus.
        Subject line included.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
      });

      const content = completion.choices[0].message.content || "Error generating email.";
      
      // Update match with generated content
      await storage.updateMatch(matchId, { emailContent: content });

      res.json({ content });
    } catch (e) {
      console.error("Error generating email", e);
      res.status(500).json({ message: "Failed to generate email" });
    }
  });

  app.patch(api.matches.update.path, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const input = api.matches.update.input.parse(req.body);
      const match = await storage.updateMatch(id, input);
      res.json(match);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}
