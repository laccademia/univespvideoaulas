import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // user = await sdk.authenticateRequest(opts.req);
    // BYPASS LOGIN: Always return admin user
    user = {
      id: 1,
      openId: "admin-bypass",
      name: "Admin (Bypass)",
      email: "admin@univesp.br",
      loginMethod: "bypass",
      role: "admin",
      passwordHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
  } catch (error) {
    // Authentication is optional for public procedures.
    // user = null;
    user = {
      id: 1,
      openId: "admin-bypass",
      name: "Admin (Bypass)",
      email: "admin@univesp.br",
      loginMethod: "bypass",
      role: "admin",
      passwordHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
