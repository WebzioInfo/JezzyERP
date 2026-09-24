import { db } from "@/db/prisma/client";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { calculateInvoiceStatus, calculatePurchaseStatus } from "@/utils/financial-status";
import { serializePrisma } from "@/utils/serialization";

export interface AccountLedgerRow {
    id: string;
    date: Date;
    type: string; // "OPENING_BALANCE" | "INVOICE" | "PURCHASE" | "PAYMENT" | "ADJUSTMENT"
    reference: string;
    description: string;
    debit: number;
    credit: number;
    runningBalance: number;
    referenceId?: string;
    referenceType?: string;
}

export interface PartyAccountSummary {
    partyId: string;
    partyType: 'CLIENT' | 'SUPPLIER';
    name: string;
    companyName: string;
    gstin: string | null;
    pan: string | null;
    phone: string | null;
    email: string | null;
    address: string;
    active: boolean;
    openingBalance: number;
    currentBalance: number;
    netOutstanding: number;
    accountStatus: string;
    
    // Turnover metrics
    totalTurnover: number;
    currentFyTurnover: number;
    previousFyTurnover: number;
    monthlyTurnover: number;
    totalDocumentCount: number;
    avgDocumentValue: number;
    totalPaid: number;
    totalUnallocated: number;

    // Dates
    lastTransactionDate: Date | null;
    createdAt: Date;
}

export interface PartyOutstandingItem {
    id: string;
    documentNo: string;
    date: Date;
    dueDate: Date;
    grandTotal: number;
    paidAmount: number;
    balanceDue: number;
    status: string;
    daysOverdue: number;
}

export class PartyAccountService {

    /**
     * Get Financial Year Date Range for a given date
     * Financial Year in India: April 1 to March 31
     */
    static getFinancialYearRange(refDate: Date = new Date()) {
        const year = refDate.getFullYear();
        const month = refDate.getMonth(); // 0 = Jan, 3 = April
        const fyStartYear = month >= 3 ? year : year - 1;
        const fyEndYear = fyStartYear + 1;

        const currentFyStart = new Date(fyStartYear, 3, 1, 0, 0, 0, 0); // April 1
        const currentFyEnd = new Date(fyEndYear, 2, 31, 23, 59, 59, 999); // March 31

        const prevFyStart = new Date(fyStartYear - 1, 3, 1, 0, 0, 0, 0);
        const prevFyEnd = new Date(fyStartYear, 2, 31, 23, 59, 59, 999);

        return {
            fyLabel: `FY ${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`,
            currentFyStart,
            currentFyEnd,
            prevFyStart,
            prevFyEnd
        };
    }

    /**
     * Fetch complete account context for Client or Vendor
     */
    static async getAccountOverview(
        partyId: string,
        partyType: 'CLIENT' | 'SUPPLIER',
        filters?: {
            startDate?: string;
            endDate?: string;
            transactionType?: string;
            search?: string;
        }
    ) {
        const isClient = partyType === 'CLIENT';

        // 1. Fetch Party Record
        let party: any = null;
        if (isClient) {
            party = await db.client.findUnique({
                where: { id: partyId },
                include: {
                    invoices: {
                        where: { deletedAt: null },
                        orderBy: { date: 'asc' },
                        include: { allocations: true }
                    },
                    payments: {
                        where: { deletedAt: null },
                        orderBy: { paidAt: 'asc' },
                        include: { allocations: true }
                    }
                }
            });
        } else {
            party = await db.vendor.findUnique({
                where: { id: partyId },
                include: {
                    purchases: {
                        where: { deletedAt: null },
                        orderBy: { date: 'asc' },
                        include: { allocations: true }
                    },
                    payments: {
                        where: { deletedAt: null },
                        orderBy: { paidAt: 'asc' },
                        include: { allocations: true }
                    }
                }
            });
        }

        if (!party) throw new Error(`${isClient ? 'Client' : 'Vendor'} not found.`);

        // 2. Fetch Double-Entry Account Record
        const account = await FinanceService.getPartyAccount(partyId, partyType);
        const openingBalance = account ? account.openingBalance.toNumber() : 0;
        
        // Ledger Entries from Double-Entry System
        let ledgerEntries: any[] = [];
        if (account) {
            ledgerEntries = await (db as any).ledgerEntry.findMany({
                where: {
                    OR: [
                        { debitAccountId: account.id },
                        { creditAccountId: account.id }
                    ]
                },
                orderBy: { date: 'asc' },
                include: {
                    debitAccount: { select: { id: true, name: true, type: true } },
                    creditAccount: { select: { id: true, name: true, type: true } }
                }
            });
        }

        // 3. Turnover Calculations
        const documents = isClient ? party.invoices : party.purchases;
        const fyRange = this.getFinancialYearRange();

        let totalTurnover = 0;
        let currentFyTurnover = 0;
        let previousFyTurnover = 0;
        let monthlyTurnover = 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        documents.forEach((doc: any) => {
            const docAmount = Number(doc.grandTotal || 0);
            const docDate = new Date(doc.date);

            totalTurnover += docAmount;

            if (docDate >= fyRange.currentFyStart && docDate <= fyRange.currentFyEnd) {
                currentFyTurnover += docAmount;
            } else if (docDate >= fyRange.prevFyStart && docDate <= fyRange.prevFyEnd) {
                previousFyTurnover += docAmount;
            }

            if (docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
                monthlyTurnover += docAmount;
            }
        });

        const totalDocumentCount = documents.length;
        const avgDocumentValue = totalDocumentCount > 0 ? totalTurnover / totalDocumentCount : 0;

        // 4. Payment Totals
        const payments = party.payments || [];
        let totalPaid = 0;
        let totalAllocated = 0;

        payments.forEach((p: any) => {
            const pAmt = Number(p.amount || 0);
            totalPaid += pAmt;
            const pAlloc = (p.allocations || []).reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0);
            totalAllocated += pAlloc;
        });

        const totalUnallocated = Math.max(0, totalPaid - totalAllocated);

        // 5. Construct Chronological Ledger Table
        const ledgerRows: AccountLedgerRow[] = [];
        let runningBalance = isClient ? openingBalance : -openingBalance;

        if (openingBalance > 0) {
            ledgerRows.push({
                id: `ob-${partyId}`,
                date: party.createdAt || new Date(2025, 0, 1),
                type: 'OPENING_BALANCE',
                reference: 'OB',
                description: 'Opening Balance',
                debit: isClient ? openingBalance : 0,
                credit: isClient ? 0 : openingBalance,
                runningBalance: runningBalance
            });
        }

        // Map Ledger Entries or fallback to Documents + Payments if double-entry wasn't recorded
        if (ledgerEntries.length > 0) {
            ledgerEntries.forEach((entry: any) => {
                const amount = Number(entry.amount || 0);
                const isDebit = entry.debitAccountId === account?.id;
                
                // For Client (Receivable): Debit increases, Credit decreases
                // For Supplier (Payable): Credit increases, Debit decreases
                let debit = 0;
                let credit = 0;

                if (isDebit) {
                    debit = amount;
                    if (isClient) runningBalance += amount;
                    else runningBalance -= amount;
                } else {
                    credit = amount;
                    if (isClient) runningBalance -= amount;
                    else runningBalance += amount;
                }

                ledgerRows.push({
                    id: entry.id,
                    date: new Date(entry.date),
                    type: entry.referenceType || (isDebit ? 'DEBIT' : 'CREDIT'),
                    reference: entry.referenceId || entry.id,
                    description: entry.description || (isDebit ? 'Debit Entry' : 'Credit Entry'),
                    debit,
                    credit,
                    runningBalance,
                    referenceId: entry.referenceId,
                    referenceType: entry.referenceType
                });
            });
        } else {
            // Fallback chronological construction directly from documents and payments
            const combinedEvents: { date: Date; type: string; doc: any }[] = [];
            documents.forEach((d: any) => combinedEvents.push({ date: new Date(d.date), type: 'DOC', doc: d }));
            payments.forEach((p: any) => combinedEvents.push({ date: new Date(p.paidAt), type: 'PAYMENT', doc: p }));

            combinedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

            combinedEvents.forEach((ev, idx) => {
                if (ev.type === 'DOC') {
                    const amt = Number(ev.doc.grandTotal || 0);
                    const docNo = ev.doc.invoiceNo || ev.doc.purchaseNo;
                    if (isClient) {
                        runningBalance += amt;
                        ledgerRows.push({
                            id: ev.doc.id,
                            date: ev.date,
                            type: 'INVOICE',
                            reference: docNo,
                            description: `Sales Invoice ${docNo}`,
                            debit: amt,
                            credit: 0,
                            runningBalance,
                            referenceId: ev.doc.id,
                            referenceType: 'INVOICE'
                        });
                    } else {
                        runningBalance += amt;
                        ledgerRows.push({
                            id: ev.doc.id,
                            date: ev.date,
                            type: 'PURCHASE',
                            reference: docNo,
                            description: `Purchase Invoice ${docNo}`,
                            debit: 0,
                            credit: amt,
                            runningBalance,
                            referenceId: ev.doc.id,
                            referenceType: 'PURCHASE'
                        });
                    }
                } else {
                    const amt = Number(ev.doc.amount || 0);
                    const ref = ev.doc.reference || ev.doc.id;
                    if (isClient) {
                        runningBalance -= amt;
                        ledgerRows.push({
                            id: ev.doc.id,
                            date: ev.date,
                            type: 'PAYMENT',
                            reference: ref,
                            description: `Payment Received (${ev.doc.method})`,
                            debit: 0,
                            credit: amt,
                            runningBalance,
                            referenceId: ev.doc.id,
                            referenceType: 'PAYMENT'
                        });
                    } else {
                        runningBalance -= amt;
                        ledgerRows.push({
                            id: ev.doc.id,
                            date: ev.date,
                            type: 'PAYMENT',
                            reference: ref,
                            description: `Payment Made (${ev.doc.method})`,
                            debit: amt,
                            credit: 0,
                            runningBalance,
                            referenceId: ev.doc.id,
                            referenceType: 'PAYMENT'
                        });
                    }
                }
            });
        }

        // 6. Outstanding & Aging Analysis
        const outstandingItems: PartyOutstandingItem[] = [];
        let totalOutstanding = 0;
        let totalOverdue = 0;
        let totalCurrentDue = 0;

        documents.forEach((doc: any) => {
            const grandTotal = Number(doc.grandTotal || 0);
            const docAllocations = (doc.allocations || []).reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0);
            const balanceDue = Math.max(0, grandTotal - docAllocations);

            if (balanceDue > 0.01) {
                totalOutstanding += balanceDue;

                const docDate = new Date(doc.date);
                // Standard 30 days payment terms if not explicitly set
                const dueDate = doc.dueDate ? new Date(doc.dueDate) : new Date(docDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                
                const diffTime = now.getTime() - dueDate.getTime();
                const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

                if (daysOverdue > 0) {
                    totalOverdue += balanceDue;
                } else {
                    totalCurrentDue += balanceDue;
                }

                const docNo = doc.invoiceNo || doc.purchaseNo;
                const computedStatus = isClient
                    ? calculateInvoiceStatus({ grandTotal, isFinalized: doc.isFinalized ?? true, allocations: doc.allocations || [], dueDate })
                    : calculatePurchaseStatus({ grandTotal, isFinalized: doc.isFinalized ?? true, allocations: doc.allocations || [], dueDate });

                outstandingItems.push({
                    id: doc.id,
                    documentNo: doc.invoiceNo || doc.purchaseNo,
                    date: docDate,
                    dueDate,
                    grandTotal,
                    paidAmount: docAllocations,
                    balanceDue,
                    status: computedStatus,
                    daysOverdue
                });
            }
        });

        // Last transaction date
        let lastTransactionDate: Date | null = null;
        if (ledgerRows.length > 0) {
            lastTransactionDate = ledgerRows[ledgerRows.length - 1].date;
        }

        // 7. Filter Application (if user passed filters)
        let filteredLedger = ledgerRows;
        if (filters?.startDate) {
            const start = new Date(filters.startDate);
            filteredLedger = filteredLedger.filter(r => new Date(r.date) >= start);
        }
        if (filters?.endDate) {
            const end = new Date(filters.endDate);
            filteredLedger = filteredLedger.filter(r => new Date(r.date) <= end);
        }
        if (filters?.transactionType && filters.transactionType !== 'ALL') {
            filteredLedger = filteredLedger.filter(r => r.type === filters.transactionType);
        }
        if (filters?.search && filters.search.trim()) {
            const q = filters.search.toLowerCase().trim();
            filteredLedger = filteredLedger.filter(r => 
                r.reference.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q)
            );
        }

        const partyAddress = [
            party.address1,
            party.address2,
            `${party.state || ''} ${party.pinCode || ''}`.trim()
        ].filter(Boolean).join(", ");

        const settings = await db.companySetting.findFirst() || { companyName: "JEZZY ENTERPRISES" };

        const summary: PartyAccountSummary = {
            partyId,
            partyType,
            name: party.name,
            companyName: settings.companyName || "JEZZY ENTERPRISES",
            gstin: party.gst || null,
            pan: (party as any).pan || null,
            phone: party.phone || null,
            email: party.email || null,
            address: partyAddress || "N/A",
            active: party.active ?? true,
            openingBalance,
            currentBalance: runningBalance,
            netOutstanding: totalOutstanding,
            accountStatus: party.active ? "ACTIVE" : "INACTIVE",
            totalTurnover,
            currentFyTurnover,
            previousFyTurnover,
            monthlyTurnover,
            totalDocumentCount,
            avgDocumentValue,
            totalPaid,
            totalUnallocated,
            lastTransactionDate,
            createdAt: party.createdAt || new Date()
        };

        return serializePrisma({
            summary,
            ledger: filteredLedger,
            fullLedger: ledgerRows,
            documents: documents.map((doc: any) => ({
                ...doc,
                status: isClient
                    ? calculateInvoiceStatus({ grandTotal: doc.grandTotal, isFinalized: doc.isFinalized ?? true, allocations: doc.allocations || [] })
                    : calculatePurchaseStatus({ grandTotal: doc.grandTotal, isFinalized: doc.isFinalized ?? true, allocations: doc.allocations || [] }),
                paidAmount: (doc.allocations || []).reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0),
                balanceDue: Math.max(0, Number(doc.grandTotal) - (doc.allocations || []).reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0))
            })),
            payments,
            outstanding: {
                totalOutstanding,
                totalOverdue,
                totalCurrentDue,
                outstandingCount: outstandingItems.length,
                items: outstandingItems
            }
        });
    }
}
