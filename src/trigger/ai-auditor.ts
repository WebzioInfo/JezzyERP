import { task, logger } from "@trigger.dev/sdk/v3";
import prisma from "@/db/prisma/client";
import { Composio } from "composio";

/**
 * AI Smart Audit Task
 * This task analyzes high-value outstanding invoices and identifies risk.
 * In a production environment, this would connect to Composio Toolkits 
 * (Slack, Gmail, etc.) to notify stakeholders.
 */
export const aiInvoiceAudit = task({
  id: "ai-invoice-audit",
  run: async (payload: { threshold: number }) => {
    logger.info("Initializing AI-powered financial audit...", { threshold: payload.threshold });

    try {
      // 1. Identify high-value outstanding invoices
      const highValueInvoices = await prisma.invoice.findMany({
        where: {
          deletedAt: null,
          status: { in: ["SENT", "PARTIAL", "OVERDUE"] },
          grandTotal: { gte: payload.threshold }
        },
        include: {
          client: { select: { name: true, email: true } }
        }
      });

      if (highValueInvoices.length === 0) {
        logger.info("No high-value risks identified. Audit clear.");
        return { riskScore: 0, actionsTaken: 0 };
      }

      logger.warn(`Identified ${highValueInvoices.length} high-value receivables at risk.`, {
        totalExposure: highValueInvoices.reduce((acc, inv) => acc + Number(inv.grandTotal), 0)
      });

      // 2. Foundation for Composio Integration
      const apiKey = process.env.COMPOSIO_API_KEY;
      if (!apiKey) {
        logger.warn("AI Audit configuration incomplete: COMPOSIO_API_KEY missing. Skipping advanced notification logic.");
        return { riskScore: highValueInvoices.length * 10, actionsTaken: 0, status: "INCOMPLETE_CONFIG" };
      }

      const composio = new Composio({ apiKey });
      
      // Intent: Audit each invoice and prepare a summary
      for (const inv of highValueInvoices) {
         // Placeholder for AI Analysis logic
         logger.info(`AI Analysis Plan: Monitoring payment history for ${inv.client.name} regarding invoice ${inv.invoiceNo}`);
         
         // Future: session = await composio.sessions.create({ user_id: "admin_1", toolkits: ["slack", "gmail"] });
         // Future: await session.execute("SLACK_POST_MESSAGE", { channel: "finance-alerts", text: `Alert: High-value invoice ${inv.invoiceNo} is ${inv.status}.` });
      }

      return { 
        riskScore: highValueInvoices.length * 10, 
        actionsTaken: highValueInvoices.length,
        exposureSummary: highValueInvoices.map(i => ({ no: i.invoiceNo, amount: i.grandTotal }))
      };
    } catch (error) {
      logger.error("AI Audit Pipeline Failed", { error });
      throw error;
    }
  },
});
