import { db } from "@/db/prisma/client";
import { Prisma } from "../db/generated/client";

/**
 * Resilient Audit Logging
 * Ensures that logging failures (like P2003 Foreign Key violations) 
 * don't crash the main business transaction.
 */
export async function recordAuditLog(
  tx: Prisma.TransactionClient | typeof db,
  data: {
    userId: string | null;
    action: string;
    entityType: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
  }
) {
  try {
    // If userId is provided, double check it exists to avoid P2003
    let targetUserId = data.userId;
    if (targetUserId) {
        const userExists = await tx.user.findUnique({
            where: { id: targetUserId },
            select: { id: true }
        });
        if (!userExists) {
            console.warn(`[AUDIT] User ${targetUserId} not found. Logging with userId: null.`);
            targetUserId = null;
        }
    }

    return await tx.auditLog.create({
      data: {
        userId: targetUserId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details ? JSON.stringify(data.details) : null,
        ipAddress: data.ipAddress,
      },
    });
  } catch (error) {
    console.error("[AUDIT] Failed to create audit log:", error);
    // We explicitly DO NOT throw here to prevent crashing the main action
    return null;
  }
}
