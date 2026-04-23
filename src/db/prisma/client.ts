import { PrismaClient } from '@prisma/client'
import { env } from '@/lib/env'

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit.
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        // Strict connection limits for development to avoid exhausting the 9-connection DB pool
        datasources: {
            db: {
                url: env.DATABASE_URL + (env.DATABASE_URL.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=30'
            }
        }
    })
}

declare const globalThis: {
    prismaGlobalV3: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Use existing global instance if available, or create a new one
const prisma = globalThis.prismaGlobalV3 ?? prismaClientSingleton()

export default prisma
export const db = prisma

if (env.NODE_ENV !== 'production') globalThis.prismaGlobalV3 = prisma

