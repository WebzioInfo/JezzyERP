import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);