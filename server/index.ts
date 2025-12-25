import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { sql } from "drizzle-orm";
import { db } from "./db";

const app = express();
const httpServer = createServer(app);

// 1. The log function you need
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// 2. The Governor (Database safety net)
async function startupGovernor() {
  log("Checking for Patty's Data...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS investors (
        id SERIAL PRIMARY KEY, name TEXT NOT NULL,
        status TEXT NOT NULL, amount TEXT NOT NULL
      );
    `);
    log("✅ System ready for demo.");
  } catch (e) {
    log("System already initialized.");
  }
}

// 3. One single startup sequence
startupGovernor().then(async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Register routes
  await registerRoutes(app);

  // Production setup
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(app, httpServer);
  }

  // THE PORT FIX: Render specifically looks for port 10000
  const port = 10000;
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
});

