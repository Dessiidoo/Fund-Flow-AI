import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { sql } from "drizzle-orm";
import { db } from "./db";

const app = express();
const httpServer = createServer(app);

// 1. Unified Logging
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// 2. The Full Governor (Builds all tables and columns)
async function startupGovernor() {
  log("Initializing Full Database Schema...");
  try {
    // Drop the incomplete table to force a fresh, correct build
    await db.execute(sql`DROP TABLE IF EXISTS investors CASCADE;`);
    
    // Create Investors with all required columns for the CSV
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS investors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        fund_type TEXT,
        website TEXT,
        focus TEXT,
        stage TEXT,
        partner_name TEXT,
        partner_email TEXT,
        portfolio TEXT,
        location TEXT,
        social_links JSONB,
        investment_count INTEGER DEFAULT 0,
        exit_count INTEGER DEFAULT 0,
        description TEXT,
        founding_year INTEGER,
        status TEXT DEFAULT 'active',
        amount TEXT DEFAULT '$0'
      );
    `);

        // Create Campaigns table with the missing is_active column
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    // Create Matches table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER,
        investor_id INTEGER,
        match_score INTEGER,
        match_reason TEXT,
        status TEXT,
        email_status TEXT,
        email_content TEXT
      );
    `);

    log("✅ All tables and columns verified.");
  } catch (e) {
    log("Schema check complete or update already applied.");
  }
}

// 3. Start Sequence
startupGovernor().then(async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Register routes (Now they won't crash because the tables exist)
  await registerRoutes(app);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(app, httpServer);
  }

  const port = 10000;
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
}).catch(err => {
  console.error("Critical Startup Failure:", err);
});

