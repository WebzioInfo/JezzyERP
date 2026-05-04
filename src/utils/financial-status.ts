/**
 * Dynamic Status Calculation Engine
 * 
 * In a Ledger-First architecture, the status of a document is a derived property
 * based on its lifecycle state (Finalized vs Draft) and its settlement standing (Allocations).
 */

export type FinancialStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface SettlementData {
    grandTotal: number;
    isFinalized: boolean;
    allocations: { amount: number }[];
    dueDate?: Date;
}

export function calculateInvoiceStatus(data: SettlementData): FinancialStatus {
    if (!data.isFinalized) return 'DRAFT';

    const totalAllocated = data.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
    const balanceDue = Number(data.grandTotal) - totalAllocated;

    if (balanceDue <= 0) return 'PAID';
    if (totalAllocated > 0) return 'PARTIAL';
    
    // If it's finalized but has no allocations, it's 'SENT'
    // If we have a due date and it's passed, it could be 'OVERDUE'
    if (data.dueDate && new Date() > new Date(data.dueDate)) {
        return 'OVERDUE';
    }

    return 'SENT';
}

export function calculatePurchaseStatus(data: SettlementData): FinancialStatus {
    if (!data.isFinalized) return 'DRAFT'; // Purchases usually start as 'RECEIVED' or similar

    const totalAllocated = data.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
    const balanceDue = Number(data.grandTotal) - totalAllocated;

    if (balanceDue <= 0) return 'PAID';
    if (totalAllocated > 0) return 'PARTIAL';

    return 'SENT'; // Using SENT as a generic 'FINALIZED but unpaid' state for now
}
