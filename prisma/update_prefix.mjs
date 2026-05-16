import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.$executeRawUnsafe("UPDATE company_settings SET invoicePrefix = 'B2B' WHERE companyId = 'jezzy-enterprises'").then(res => console.log('Updated invoicePrefix to B2B')).finally(() => prisma.$disconnect())
