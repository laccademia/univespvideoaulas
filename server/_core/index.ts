import "dotenv/config";
import express, { type Express } from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export async function createApp(): Promise<{ app: Express; server: any }> {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else if (!process.env.VERCEL) {
    // Only serve static files if NOT on Vercel (Vercel handles this via CDN)
    serveStatic(app);
  }
  return { app, server };
}

async function startServer() {
  const { server } = await createApp();

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    import "dotenv/config";
    import express, { type Express } from "express";
    import { createServer } from "http";
    import net from "net";
    import { createExpressMiddleware } from "@trpc/server/adapters/express";
    import { registerOAuthRoutes } from "./oauth";
    import { appRouter } from "../routers";
    import { createContext } from "./context";
    import { serveStatic, setupVite } from "./vite";
    import path from "path"; // Added import for 'path'

    function isPortAvailable(port: number): Promise<boolean> {
      return new Promise(resolve => {
        const server = net.createServer();
        server.listen(port, () => {
          server.close(() => resolve(true));
        });
        server.on("error", () => resolve(false));
      });
    }

    async function findAvailablePort(startPort: number = 3000): Promise<number> {
      for (let port = startPort; port < startPort + 20; port++) {
        if (await isPortAvailable(port)) {
          return port;
        }
      }
      throw new Error(`No available port found starting from ${startPort}`);
    }

    export async function createApp(): Promise<{ app: Express; server: any }> {
      const app = express();
      const server = createServer(app);
      // Configure body parser with larger size limit for file uploads
      app.use(express.json({ limit: "50mb" }));
      app.use(express.urlencoded({ limit: "50mb", extended: true }));
      // OAuth callback under /api/oauth/callback
      registerOAuthRoutes(app);
      // tRPC API
      app.use(
        "/api/trpc",
        createExpressMiddleware({
          router: appRouter,
          createContext,
        })
      );
      // development mode uses Vite, production mode uses static files
      if (process.env.NODE_ENV === "development") {
        await setupVite(app, server);
      } else if (!process.env.VERCEL) {
        // Only serve static files if NOT on Vercel (Vercel handles this via CDN)
        serveStatic(app);
      }
      return { app, server };
    }

    async function startServer() {
      const { server } = await createApp();

      const preferredPort = parseInt(process.env.PORT || "3000");
      const port = await findAvailablePort(preferredPort);

      if (port !== preferredPort) {
        console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
      }

      server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}/`);
      });
    }

    // Only start the server if this file is run directly
    import { fileURLToPath } from 'url';
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      startServer().catch(console.error);
    }
    // The following line was added based on the instruction, assuming it was intended to be a new line or a modification to an existing one.
    // The original instruction snippet was malformed, so this is an interpretation to make it syntactically valid.
    // If this was meant to replace an existing line, please provide a clearer instruction.
    const distPath = path.resolve(import.meta.dirname, "../..", "dist");
