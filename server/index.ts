
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { sql } from "drizzle-orm";
import { db } from "./db";

const app = express();
const httpServer = createServer(app);

// 1. Define the missing log function to prevent ReferenceErrors
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// 2. THE GOVERNOR: Self-healing database setup
async function startupGovernor() {
  log("Checking for Patty's Data...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS investors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        amount TEXT NOT NULL
      );
    `);
    log("✅ System ready for demo.");
  } catch (e) {
    log("System already initialized or connection pending.");
  }
}

// 3. THE EXECUTION: Controlled startup
startupGovernor().then(async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Logging middleware with the captured JSON fix
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        log(logLine);
      }
    });
    next();
  });

  // Register routes ONLY after table is created
  await registerRoutes(app);

  // Error handling
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Production vs Dev setup
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(app, httpServer);
  }

  // Final step: Start the engine on Render's port
  const port = parseInt(process.env.PORT || "10000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
}).catch(err => {
  console.error("Critical Startup Failure:", err);
  process.exit(1);
});
