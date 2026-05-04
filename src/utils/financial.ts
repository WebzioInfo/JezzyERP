import { Decimal } from "@prisma/client/runtime/library";

/**
 * Rounds a number or Decimal to 2 decimal places.
 * Uses Math.round for consistent business logic.
 */
export function roundTo2(value: number | Decimal | string): number {
  const num = typeof value === 'object' && 'toNumber' in value ? value.toNumber() : Number(value);
  if (isNaN(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates the total balance from a list of ledger entries.
 * Balance = Sum of CREDITS - Sum of DEBITS
 */
export function calculateBalance(entries: { type: 'CREDIT' | 'DEBIT', amount: number | Decimal }[]): number {
  return entries.reduce((acc, entry) => {
    const amount = typeof entry.amount === 'object' && 'toNumber' in entry.amount ? entry.amount.toNumber() : Number(entry.amount);
    return entry.type === 'CREDIT' ? acc + amount : acc - amount;
  }, 0);
}
