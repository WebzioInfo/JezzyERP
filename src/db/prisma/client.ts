import { PrismaClient } from '../generated/client'

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        // Strict connection limits for development to avoid exhausting the 9-connection DB pool
        datasources: {
            db: {
                url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=30'
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

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobalV3 = prisma
