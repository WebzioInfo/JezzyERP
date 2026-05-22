import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const tables = await prisma.$queryRaw`SHOW TABLES`
    console.log('Tables in database:', tables)
  } catch (error) {
    console.error('Error querying database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
