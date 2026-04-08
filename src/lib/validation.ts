import { ZodSchema } from "zod";

export class ValidationError extends Error {
  constructor(public errors: any) {
    super("Validation Failed");
    this.name = "ValidationError";
  }
}

export async function validateData<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

export function handleActionError(error: any) {
  console.error("Action Error:", error);
  
  if (error instanceof ValidationError) {
    return { error: "Validation failed", fields: error.errors };
  }
  
  return { error: error.message || "An unexpected error occurred" };
}
