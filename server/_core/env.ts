import { z } from "zod";

const envSchema = z.object({
  databaseUrl: z.string().min(1),
  isProduction: z.boolean().default(false),
  port: z.string().default("3000"),
  jwtSecret: z.string().default("secret"),
  appId: z.string().default("infinityx"),
  
  // ✅ ADDED THESE TO FIX BUILD ERRORS
  ownerOpenId: z.string().optional().default(""),
  forgeApiUrl: z.string().optional().default(""),
  forgeApiKey: z.string().optional().default(""),
  frontendForgeApiUrl: z.string().optional().default(""),
});

export const ENV = envSchema.parse({
  databaseUrl: process.env.DATABASE_URL || "",
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  appId: process.env.VITE_APP_ID,
  
  // Map process envs to these keys
  ownerOpenId: process.env.OWNER_OPEN_ID,
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL,
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY,
  frontendForgeApiUrl: process.env.VITE_FRONTEND_FORGE_API_URL,
});