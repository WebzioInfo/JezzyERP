import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.$queryRawUnsafe('SELECT invoicePrefix, logoUrl FROM company_settings LIMIT 1').then(res => console.log(res)).finally(() => prisma.$disconnect())
