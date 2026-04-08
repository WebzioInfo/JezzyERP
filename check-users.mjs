
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        createdAt: true
      }
    })
    console.log(`User count: ${userCount}`)
    console.log('Users:', JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
