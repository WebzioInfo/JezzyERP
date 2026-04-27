import { db } from "@/db/prisma/client";
// Local Enum Overrides (Hard Fix for Prisma Stale-ness on Windows)
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export const InvoiceStatus = {
  DRAFT: 'DRAFT' as const,
  SENT: 'SENT' as const,
  PARTIAL: 'PARTIAL' as const,
  PAID: 'PAID' as const,
  OVERDUE: 'OVERDUE' as const,
  CANCELLED: 'CANCELLED' as const,
};

export type GstType = 'CGST_SGST' | 'IGST' | 'NONE';
export const GstType = {
  CGST_SGST: 'CGST_SGST' as const,
  IGST: 'IGST' as const,
  NONE: 'NONE' as const,
};

export class ReportService {
  /**
   * Aggregates revenue and tax totals for a given date range.
   */
  static async getRevenueSummary(startDate: Date, endDate: Date) {
    // 1. Total Aggregation
    const aggregates = await db.invoice.aggregate({
      where: {
        deletedAt: null,
        date: { gte: startDate, lte: endDate },
        status: { in: [InvoiceStatus.PAID, InvoiceStatus.PARTIAL, InvoiceStatus.SENT] },
      },
      _sum: {
        grandTotal: true,
        subTotal: true,
        taxTotal: true,
      },
      _count: {
        id: true,
      }
    });

    // 2. GST Breakdown by Grouping
    const gstBreakdown = await db.invoice.groupBy({
      by: ['gstType'],
      where: {
        deletedAt: null,
        date: { gte: startDate, lte: endDate },
        status: { in: [InvoiceStatus.PAID, InvoiceStatus.PARTIAL, InvoiceStatus.SENT] },
      },
      _sum: {
        taxTotal: true,
      }
    });

    const summary = {
      totalRevenue: Number(aggregates._sum.grandTotal || 0),
      totalTax: Number(aggregates._sum.taxTotal || 0),
      cgst: 0,
      sgst: 0,
      igst: 0,
      count: aggregates._count.id,
    };

    gstBreakdown.forEach((group) => {
      const tax = Number(group._sum.taxTotal || 0);
      if (group.gstType === GstType.CGST_SGST) {
        summary.cgst = tax / 2;
        summary.sgst = tax / 2;
      } else if (group.gstType === GstType.IGST) {
        summary.igst = tax;
      }
    });

    return summary;
  }

  /**
   * Generates monthly revenue data for charts.
   * Optimized to use database-level grouping if possible, but MySQL Date extraction 
   * in Prisma is limited without raw SQL, so we'll use a more efficient fetch.
   */
  static async getMonthlyRevenue(year: number) {
    const invoices = await db.invoice.findMany({
      where: {
        deletedAt: null,
        date: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59),
        },
      },
      select: {
        grandTotal: true,
        date: true,
      },
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(year, i, 1)),
      revenue: 0,
    }));

    invoices.forEach((inv) => {
      const month = new Date(inv.date).getMonth();
      monthlyData[month].revenue += Number(inv.grandTotal);
    });

    return monthlyData;
  }

  /**
   * Aggregates revenue by client using groupBy.
   */
  static async getClientRevenue(limit: number = 10) {
    const clientRevenue = await db.invoice.groupBy({
      by: ['clientId'],
      where: { deletedAt: null },
      _sum: {
        grandTotal: true,
      },
      orderBy: {
        _sum: {
          grandTotal: 'desc'
        }
      },
      take: limit,
    });

    // Fetch client names for the resulting IDs
    const clientIds = clientRevenue.map(cr => cr.clientId);
    const clients = await db.client.findMany({
      where: { id: { in: clientIds } },
      select: { id: true, name: true }
    });

    const clientMap = new Map(clients.map(c => [c.id, c.name]));

    return clientRevenue.map(cr => ({
      name: clientMap.get(cr.clientId) || "Unknown Client",
      value: Number(cr._sum.grandTotal || 0),
    }));
  }

  /**
   * Calculates GST Reconciliation (Output vs Input Tax).
   */
  static async getGstReconciliation(startDate: Date, endDate: Date) {
    const [outputGroups, inputGroups] = await Promise.all([
      db.invoice.groupBy({
        by: ['gstType'],
        where: { deletedAt: null, date: { gte: startDate, lte: endDate } },
        _sum: { taxTotal: true }
      }),
      db.purchase.groupBy({
        by: ['gstType'],
        where: { deletedAt: null, date: { gte: startDate, lte: endDate } },
        _sum: { taxTotal: true }
      })
    ]);

    const reconciliation = {
      outputTax: 0,
      outputCgst: 0,
      outputSgst: 0,
      outputIgst: 0,
      inputTax: 0,
      inputCgst: 0,
      inputSgst: 0,
      inputIgst: 0,
      netTaxPayable: 0
    };

    outputGroups.forEach(group => {
      const tax = Number(group._sum.taxTotal || 0);
      reconciliation.outputTax += tax;
      if (group.gstType === GstType.CGST_SGST) {
        reconciliation.outputCgst += tax / 2;
        reconciliation.outputSgst += tax / 2;
      } else if (group.gstType === GstType.IGST) {
        reconciliation.outputIgst += tax;
      }
    });

    inputGroups.forEach(group => {
      const tax = Number(group._sum.taxTotal || 0);
      reconciliation.inputTax += tax;
      if (group.gstType === GstType.CGST_SGST) {
        reconciliation.inputCgst += tax / 2;
        reconciliation.inputSgst += tax / 2;
      } else if (group.gstType === GstType.IGST) {
        reconciliation.inputIgst += tax;
      }
    });

    reconciliation.netTaxPayable = reconciliation.outputTax - reconciliation.inputTax;

    return reconciliation;
  }
}
