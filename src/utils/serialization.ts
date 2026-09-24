/**
 * Utility for robust serialization of Prisma models & database entities.
 * Ensures compatibility across Next.js Server Components -> Client Components boundaries.
 * Correctly converts Decimal objects, BigInts, and nested structures without data loss.
 */

export function serializePrisma<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Primitive Types (string, number, boolean, symbol)
  const dataType = typeof data;
  if (dataType === "string" || dataType === "number" || dataType === "boolean" || dataType === "symbol") {
    return data;
  }

  // Handle BigInt
  if (dataType === "bigint") {
    return Number(data) as unknown as T;
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializePrisma(item)) as unknown as T;
  }

  // Handle Dates
  if (data instanceof Date) {
    return new Date(data.getTime()) as unknown as T;
  }

  // Handle Objects
  if (dataType === "object") {
    const obj = data as Record<string, any>;

    // Robust Prisma Decimal / Decimal.js detection
    const isDecimal = Boolean(
      obj &&
      (
        typeof obj.toNumber === "function" ||
        typeof obj.toFixed === "function" ||
        obj._isDecimal === true ||
        obj.constructor?.name === "Decimal" ||
        obj.constructor?.name === "Decimal2" ||
        (obj.d !== undefined && obj.e !== undefined && obj.s !== undefined)
      )
    );

    if (isDecimal) {
      if (typeof obj.toNumber === "function") {
        const val = obj.toNumber();
        return (isNaN(val) ? 0 : val) as unknown as T;
      }
      if (typeof obj.toString === "function") {
        const val = Number(obj.toString());
        return (isNaN(val) ? 0 : val) as unknown as T;
      }
      const val = Number(obj);
      return (isNaN(val) ? 0 : val) as unknown as T;
    }

    // Traverse Plain Objects
    const serialized: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      serialized[key] = serializePrisma(obj[key]);
    }
    return serialized as unknown as T;
  }

  return data;
}

