import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
  const tables = ['clients','products','invoices','payments','payment_allocations','accounts','ledger_entries','loans','advances','quotations','quotation_line_items','invoice_line_items','vendors','purchases','purchase_line_items','stocks','stock_logs','audit_logs','company_settings','expenses','export_logs']
  for (const t of tables) {
    try {
      await prisma.$executeRawUnsafe('SELECT companyId FROM ' + t + ' LIMIT 1')
      console.log(t + ': HAS companyId')
    } catch(e) {
      console.log(t + ': NO companyId')
    }
  }
}

run().finally(() => prisma.$disconnect())
