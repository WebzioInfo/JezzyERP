
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL)
    await prisma.$connect()
    console.log('Successfully connected to the database!')
    const tables = await prisma.$queryRaw`SELECT name FROM sys.tables`
    console.log('Tables:', tables)
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
