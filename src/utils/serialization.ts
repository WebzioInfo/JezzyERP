/**
 * This utility handles serialization of Prisma-specific types that are not 
 * compatible with Next.js Client Components (e.g., Decimal objects).
 */

/**
 * Recursively traverses an object and converts Prisma Decimal objects to standard numbers.
 * This is necessary because Next.js Client Components only accept "plain objects".
 */
export function serializePrisma<T>(data: T): any {
  if (data === null || data === undefined) return data;

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map(serializePrisma);
  }

  // Handle Dates (Next.js supports Dates, but we keep them as is)
  if (data instanceof Date) {
    return data;
  }

  // Handle Objects
  if (typeof data === "object") {
    // Check for Prisma Decimal (robust detection for minified builds)
    const isDecimal = data && 
      typeof (data as any).toNumber === "function" && 
      Array.isArray((data as any).d) && 
      typeof (data as any).s === "number" && 
      typeof (data as any).e === "number";

    if (isDecimal) {
      return (data as any).toNumber();
    }

    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = serializePrisma((data as any)[key]);
      }
    }
    return serialized;
  }

  return data;
}
