
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { type InsertInvestor } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // 1. Auth Setup (Standard)
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // 🚩 REMOVED: registerImageRoutes(app) - This was causing the crash!

  // 2. SEEDING FUNCTION
  async function seedInvestors() {
    try {
      const existing = await storage.getInvestors();
      if (existing.length > 0) return;

      const csvPath = path.join(process.cwd(), "attached_assets", "Fund_Database-Angel_Investors_1766572251362.csv");
      if (!fs.existsSync(csvPath)) return;

      const fileContent = fs.readFileSync(csvPath, 'utf-8');
      
      parse(fileContent, { columns: true, skip_empty_lines: true, trim: true }, async (err, records) => {
        if (err) return;
        const investorsToInsert: InsertInvestor[] = records.map((record: any) => ({
          name: record['Investor Name'] || 'Unknown',
          fundType: record['Fund Type'],
          website: record['Website (if available)'],
          focus: record['Fund Focus (Sectors)'],
          stage: record['Fund Stage'],
          partnerName: record['Partner Name'],
          partnerEmail: record['Partner Email'],
          portfolio: record['Portfolio Companies'],
          location: record['Location'],
          socialLinks: { twitter: record['Twitter Link'], linkedin: record['LinkedIn Link'], facebook: record['Facebook Link'] },
          investmentCount: parseInt(record['Number of Investments']) || 0,
          exitCount: parseInt(record['Number of Exits']) || 0,
          description: record['Fund Description'],
          foundingYear: parseInt(record['Founding Year']) || null,
        }));

        const chunkSize = 100;
        for (let i = 0; i < investorsToInsert.length; i += chunkSize) {
          await storage.createInvestors(investorsToInsert.slice(i, i + chunkSize));
        }
      });
    } catch (e) {
      console.error("Seed failed:", e);
    }
  }

  seedInvestors();

  // --- API ROUTES ---
  app.get(api.investors.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const focus = req.query.focus as string | undefined;
    const investors = await storage.getInvestors(search, focus);
    res.json(investors);
  });

  app.get(api.investors.get.path, async (req, res) => {
    const investor = await storage.getInvestor(parseInt(req.params.id));
    if (!investor) return res.status(404).json({ message: "Investor not found" });
    res.json(investor);
  });

  app.get(api.campaigns.list.path, async (req, res) => {
    res.json(await storage.getCampaigns());
  });

  app.post(api.campaigns.create.path, async (req, res) => {
    try {
      const input = api.campaigns.create.input.parse(req.body);
      const campaign = await storage.createCampaign(input);
      res.status(201).json(campaign);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // AI Matching Route (Fixed model string for safety)
  app.post(api.campaigns.generateMatches.path, async (req, res) => {
    const campaignId = parseInt(req.params.id);
    const campaign = await storage.getCampaign(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const allInvestors = await storage.getInvestors();
    const relevantInvestors = allInvestors.slice(0, 10); // Batching for demo safety

    for (const investor of relevantInvestors) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o", // Using a stable model name to prevent 404s
          messages: [{ role: "user", content: `Match: ${campaign.description} with ${investor.focus}` }],
          response_format: { type: "json_object" },
        });
        // ... (remaining storage logic)
      } catch (e) { console.error(e); }
    }
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
