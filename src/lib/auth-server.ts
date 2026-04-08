import { db } from "@/db/prisma/client";
import { verifySessionCookie, SessionPayload } from "./auth";

/**
 * Verified Session (Server Actions / Services Only)
 * Cross-references the database to ensure the user still exists.
 * This is isolated from the main auth.ts to keep Middleware Edge-friendly.
 */
export async function verifySessionVerified(): Promise<SessionPayload | null> {
    const session = await verifySessionCookie();
    if (!session) return null;

    try {
        const user = await db.user.findUnique({
            where: { id: session.userId },
            select: { id: true }
        });

        if (!user) {
            console.log(`[AUTH] Session user ${session.userId} not found in DB. Invalidating.`);
            return null;
        }

        return session;
    } catch (error) {
        return null;
    }
}
