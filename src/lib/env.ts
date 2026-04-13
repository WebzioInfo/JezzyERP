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
        console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
        throw new Error("Invalid environment variables. Please check your .env file or deployment settings.");
    }
}

// During build phase, we provide safe fallbacks if validation failed
export const env = parsed.success ? parsed.data : {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock",
    JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_for_build_phase_min_32_characters_long",
    NODE_ENV: (process.env.NODE_ENV as any) || "development",
};