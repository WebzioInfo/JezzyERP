import { db } from "@/db/prisma/client";

export class ReportService {
  /**
   * Aggregates revenue and tax totals for a given date range.
   */
  static async getRevenueSummary(startDate: Date, endDate: Date) {
    const invoices = await db.invoice.findMany({
      where: {
        deletedAt: null,
        date: { gte: startDate, lte: endDate },
        status: { in: ["PAID", "PARTIAL", "SENT"] }, // Include billed but unpaid for and revenue tracking
      },
      select: {
        grandTotal: true,
        subTotal: true,
        taxTotal: true,
        gstType: true,
        date: true,
      },
      orderBy: { date: "asc" },
    });

    const summary = {
      totalRevenue: 0,
      totalTax: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      count: invoices.length,
    };

    invoices.forEach((inv) => {
      const gTotal = inv.grandTotal.toNumber();
      const sTotal = inv.subTotal.toNumber();
      const tTotal = inv.taxTotal.toNumber();

      summary.totalRevenue += gTotal;
      summary.totalTax += tTotal;

      if (inv.gstType === "CGST_SGST") {
        summary.cgst += tTotal / 2;
        summary.sgst += tTotal / 2;
      } else if (inv.gstType === "IGST") {
        summary.igst += tTotal;
      }
    });

    return summary;
  }

  /**
   * Generates monthly revenue data for charts.
   */
  static async getMonthlyRevenue(year: number) {
    const invoices = await db.invoice.findMany({
      where: {
        deletedAt: null,
        date: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31),
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
      monthlyData[month].revenue += inv.grandTotal.toNumber();
    });

    return monthlyData;
  }

  /**
   * Aggregates revenue by client.
   */
  static async getClientRevenue(limit: number = 10) {
    const clients = await db.client.findMany({
      where: { deletedAt: null },
      include: {
        invoices: {
          where: { deletedAt: null },
          select: { grandTotal: true },
        },
      },
    });

    const clientData = clients.map((c) => ({
      name: c.name,
      value: c.invoices.reduce((sum, inv) => sum + inv.grandTotal.toNumber(), 0),
    }))
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

    return clientData;
  }

  /**
   * Calculates GST Reconciliation (Output vs Input Tax).
   */
  static async getGstReconciliation(startDate: Date, endDate: Date) {
    const [invoices, purchases] = await Promise.all([
      db.invoice.findMany({
        where: { deletedAt: null, date: { gte: startDate, lte: endDate } },
        select: { taxTotal: true, gstType: true }
      }),
      db.purchase.findMany({
        where: { deletedAt: null, date: { gte: startDate, lte: endDate } },
        select: { taxTotal: true, gstType: true }
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

    invoices.forEach((inv: any) => {
      const tax = inv.taxTotal.toNumber();
      reconciliation.outputTax += tax;
      if (inv.gstType === "CGST_SGST") {
        reconciliation.outputCgst += tax / 2;
        reconciliation.outputSgst += tax / 2;
      } else {
        reconciliation.outputIgst += tax;
      }
    });

    purchases.forEach((pur: any) => {
      const tax = pur.taxTotal.toNumber();
      reconciliation.inputTax += tax;
      if (pur.gstType === "CGST_SGST") {
        reconciliation.inputCgst += tax / 2;
        reconciliation.inputSgst += tax / 2;
      } else {
        reconciliation.inputIgst += tax;
      }
    });

    reconciliation.netTaxPayable = reconciliation.outputTax - reconciliation.inputTax;

    return reconciliation;
  }
}
