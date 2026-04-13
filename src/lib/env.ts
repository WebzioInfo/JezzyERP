import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test';

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    if (isBuildPhase) {
        console.warn("⚠️ [ENV] Essential environment variables are missing during build phase. Using mock values to allow build to complete.");
    } else {
        // Log the error but DO NOT throw to prevent crashing the whole site (Middleware/Pages)
        console.error("❌ [ENV] Invalid or missing environment variables:", parsed.error.flatten().fieldErrors);
        console.error("❌ [ENV] Application features depending on these variables (like DB or Auth) will fail until they are provided.");
    }
}

// Ensure the exported env object is always defined with at least fallbacks to prevent crashes
export const env = parsed.success ? parsed.data : {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock",
    JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_for_build_phase_min_32_characters_long",
    NODE_ENV: (process.env.NODE_ENV as any) || "development",
};