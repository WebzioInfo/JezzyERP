import { db } from "@/db/prisma/client";
import { Prisma } from "@prisma/client";

export class AllocationService {
    /**
     * Auto-allocates a payment amount to the oldest unpaid invoices for a client.
     */
    static async allocateClientPayment(tx: any, paymentId: string, clientId: string, amount: number) {
        // 1. Headroom Check
        const payment = await tx.payment.findUnique({
            where: { id: paymentId },
            select: {
                id: true,
                amount: true,
                allocations: {
                    select: {
                        id: true,
                        amount: true,
                        invoiceId: true,
                        // purchaseId omitted
                    }
                }
            }
        });

        if (!payment) throw new Error("Payment record not found for allocation.");
        
        const currentTotalAllocated = payment.allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
        const headroom = Number(payment.amount) - currentTotalAllocated;
        
        if (amount > headroom + 0.01) {
            throw new Error(`Payment headroom breach: Attempted to allocate ${amount} but only ${headroom} is available.`);
        }

        let remainingAmount = amount;
        if (remainingAmount <= 0) return;

        // 2. Find all unpaid or partially paid invoices for the client
        const invoices = await (tx.invoice as any).findMany({
            where: { 
                clientId, 
                deletedAt: null,
                isFinalized: true,
                status: { notIn: ['PAID', 'CANCELLED'] }
            },
            orderBy: { date: 'asc' },
            select: {
                id: true,
                grandTotal: true,
                allocations: {
                    select: {
                        id: true,
                        amount: true,
                        invoiceId: true,
                        // purchaseId omitted
                    }
                }
            }
        });

        for (const invoice of invoices) {
            if (remainingAmount <= 0) break;

            const totalAllocated = invoice.allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
            const due = Number(invoice.grandTotal) - totalAllocated;

            if (due > 0.01) {
                const allocationAmount = Math.min(remainingAmount, due);

                await tx.paymentAllocation.create({
                    data: {
                        paymentId,
                        invoiceId: invoice.id,
                        amount: allocationAmount
                    }
                });

                remainingAmount -= allocationAmount;

                // Sync the cached status
                await this.syncDocumentStatus(tx, invoice.id, 'INVOICE');
            }
        }
    }

    /**
     * Auto-allocates a payment amount to the oldest unpaid purchases for a vendor.
     */
    static async allocateVendorPayment(tx: any, paymentId: string, vendorId: string, amount: number) {
        // 1. Headroom Check
        const payment = await tx.payment.findUnique({
            where: { id: paymentId },
            include: { allocations: true }
        });
        if (!payment) throw new Error("Payment record not found for allocation.");
        
        const currentTotalAllocated = payment.allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
        const headroom = Number(payment.amount) - currentTotalAllocated;
        
        if (amount > headroom + 0.01) {
            throw new Error(`Payment headroom breach: Attempted to allocate ${amount} but only ${headroom} is available.`);
        }

        let remainingAmount = amount;
        if (remainingAmount <= 0) return;

        // 2. Find all unpaid or partially paid purchases for the vendor
        const purchases = await (tx.purchase as any).findMany({
            where: { 
                vendorId, 
                deletedAt: null,
                isFinalized: true,
                status: { notIn: ['PAID', 'CANCELLED'] }
            },
            orderBy: { date: 'asc' },
            include: { allocations: true }
        });

        for (const purchase of purchases) {
            if (remainingAmount <= 0) break;

            const totalAllocated = purchase.allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
            const due = Number(purchase.grandTotal) - totalAllocated;

            if (due > 0.01) {
                const allocationAmount = Math.min(remainingAmount, due);

                await tx.paymentAllocation.create({
                    data: {
                        paymentId,
                        purchaseId: purchase.id,
                        amount: allocationAmount
                    }
                });

                remainingAmount -= allocationAmount;

                // Sync the cached status
                await this.syncDocumentStatus(tx, purchase.id, 'PURCHASE');
            }
        }
    }

    /**
     * Finds unallocated credit on a client's ledger and applies it to a newly finalized invoice.
     */
    static async consumeClientAdvance(tx: any, clientId: string, invoiceId: string) {
        const creditPayments = await this.getUnallocatedPayments(tx, clientId, 'CLIENT');
        if (creditPayments.length === 0) return;

        const invoice = await (tx.invoice as any).findUnique({
            where: { id: invoiceId },
            include: { allocations: true }
        });

        if (!invoice || !invoice.isFinalized) return;

        const totalAllocated = invoice.allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
        let due = Number(invoice.grandTotal) - totalAllocated;

        for (const credit of creditPayments) {
            if (due <= 0.01) break;

            const allocationAmount = Math.min(credit.available, due);
            
            await tx.paymentAllocation.create({
                data: {
                    paymentId: credit.id,
                    invoiceId: invoice.id,
                    amount: allocationAmount
                }
            });

            due -= allocationAmount;
        }

        // Sync the cached status
        await this.syncDocumentStatus(tx, invoiceId, 'INVOICE');
    }

    /**
     * Re-calculates and CACHES the status for an invoice or purchase.
     */
    static async syncDocumentStatus(tx: any, id: string, type: 'INVOICE' | 'PURCHASE') {
        const model = type === 'INVOICE' ? tx.invoice : tx.purchase;
        const doc = await model.findUnique({
            where: { id },
            select: {
                id: true,
                grandTotal: true,
                isFinalized: true,
                status: true,
                allocations: {
                    select: {
                        id: true,
                        amount: true,
                        invoiceId: true,
                        // purchaseId omitted
                    }
                }
            }
        });

        if (!doc) return;

        if (!doc.isFinalized) {
            await model.update({ where: { id }, data: { status: 'DRAFT' } });
            return;
        }

        const totalAllocated = doc.allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
        const balanceDue = Number(doc.grandTotal) - totalAllocated;

        let status = 'SENT'; 
        if (balanceDue <= 0.01) {
            status = 'PAID';
        } else if (totalAllocated > 0.01) {
            status = 'PARTIAL';
        }

        await model.update({
            where: { id },
            data: { status }
        });
    }

    /**
     * Reverses all allocations associated with a payment and syncs affected documents.
     */
    static async reverseAllocations(tx: any, paymentId: string) {
        const allocations = await tx.paymentAllocation.findMany({
            where: { paymentId }
        });

        const affectedInvoices = Array.from(new Set(allocations.map((a: any) => a.invoiceId).filter(Boolean)));
        const affectedPurchases = Array.from(new Set(allocations.map((a: any) => a.purchaseId).filter(Boolean)));

        await tx.paymentAllocation.deleteMany({
            where: { paymentId }
        });

        for (const id of affectedInvoices) await this.syncDocumentStatus(tx, id as string, 'INVOICE');
        for (const id of affectedPurchases) await this.syncDocumentStatus(tx, id as string, 'PURCHASE');
    }

    /**
     * Calculates the total unallocated credit (Advance) for a client or vendor.
     */
    static async getUnallocatedBalance(tx: any, partyId: string, partyType: 'CLIENT' | 'SUPPLIER'): Promise<number> {
        const unallocated = await this.getUnallocatedPayments(tx, partyId, partyType);
        return unallocated.reduce((sum, p) => sum + p.available, 0);
    }

    /**
     * Internal helper to find payments with remaining headroom.
     */
    private static async getUnallocatedPayments(tx: any, partyId: string, partyType: 'CLIENT' | 'SUPPLIER') {
        const where = partyType === 'CLIENT' 
            ? { clientId: partyId, deletedAt: null }
            : { id: 'MISSING_VENDOR_SUPPORT' }; // vendorId column missing in DB

        const payments = await tx.payment.findMany({
            where,
            select: {
                id: true,
                amount: true,
                paidAt: true,
                allocations: true,
                // vendorId omitted
            },
            orderBy: { paidAt: 'asc' }
        });


        const creditPayments: { id: string, available: number }[] = [];
        for (const p of payments) {
            const allocated = p.allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
            const available = Number(p.amount) - allocated;
            if (available > 0.01) {
                creditPayments.push({ id: p.id, available });
            }
        }
        return creditPayments;
    }

}
