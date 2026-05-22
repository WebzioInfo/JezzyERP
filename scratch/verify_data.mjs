import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Database Integrity Verification Report ---')
  
  // 1. Check Clients
  const clientCount = await prisma.client.count()
  const clients = await prisma.client.findMany({ select: { id: true, name: true, gst: true } })
  console.log(`Clients count: ${clientCount}`)
  clients.forEach(c => console.log(`  - ${c.name} (GST: ${c.gst || 'None'}, ID: ${c.id})`))
  
  // 2. Check Products & Stocks
  const productCount = await prisma.product.count()
  const stocks = await prisma.stock.findMany({
    include: { product: { select: { sku: true, unit: true } } }
  })
  console.log(`Products count: ${productCount}`)
  stocks.forEach(s => console.log(`  - Product ${s.product.sku}: Stock = ${s.quantity} ${s.product.unit}`))

  // 3. Check Users
  const userCount = await prisma.user.count()
  const users = await prisma.user.findMany({ select: { email: true, role: true } })
  console.log(`Users count: ${userCount}`)
  users.forEach(u => console.log(`  - ${u.email} (Role: ${u.role})`))

  // 4. Check Invoices
  const invoiceCount = await prisma.invoice.count()
  const invoices = await prisma.invoice.findMany({
    orderBy: { sequenceNumber: 'asc' },
    select: { invoiceNo: true, date: true, grandTotal: true, status: true }
  })
  console.log(`Invoices count: ${invoiceCount}`)
  invoices.forEach(i => console.log(`  - Invoice ${i.invoiceNo}: Date = ${i.date.toISOString().split('T')[0]}, Total = ₹${i.grandTotal}, Status = ${i.status}`))

  // 5. Check Payments
  const paymentCount = await prisma.payment.count()
  const payments = await prisma.payment.findMany({
    select: { id: true, amount: true, paidAt: true, method: true, reference: true }
  })
  console.log(`Payments count: ${paymentCount}`)
  payments.forEach(p => console.log(`  - Payment ${p.id}: Amount = ₹${p.amount}, Date = ${p.paidAt.toISOString().split('T')[0]}, Method = ${p.method}, Ref = ${p.reference}`))

  // 6. Check Payment Allocations
  const allocationCount = await prisma.paymentAllocation.count()
  const allocations = await prisma.paymentAllocation.findMany({
    select: { id: true, paymentId: true, invoiceId: true, amount: true }
  })
  console.log(`Payment Allocations count: ${allocationCount}`)
  allocations.forEach(a => console.log(`  - Allocation ${a.id}: Payment = ${a.paymentId}, Invoice = ${a.invoiceId}, Amount = ₹${a.amount}`))

  // 7. Verify Double-Entry Balance
  // We want to ensure Sum(Debits) == Sum(Credits) for all accounts
  const accounts = await prisma.account.findMany()
  console.log('Accounts Chart & Balances:')
  let totalDebitBal = 0
  let totalCreditBal = 0
  
  for (const acc of accounts) {
    const debits = await prisma.ledgerEntry.aggregate({
      where: { debitAccountId: acc.id },
      _sum: { amount: true }
    })
    const credits = await prisma.ledgerEntry.aggregate({
      where: { creditAccountId: acc.id },
      _sum: { amount: true }
    })
    
    const debVal = debits._sum.amount?.toNumber() || 0
    const credVal = credits._sum.amount?.toNumber() || 0
    const net = debVal - credVal
    
    console.log(`  - ${acc.name} (${acc.type}): Debits = ₹${debVal.toFixed(2)}, Credits = ₹${credVal.toFixed(2)}, Net = ₹${net.toFixed(2)}`)
    
    totalDebitBal += debVal
    totalCreditBal += credVal
  }
  
  console.log(`Total Debits Posted: ₹${totalDebitBal.toFixed(2)}`)
  console.log(`Total Credits Posted: ₹${totalCreditBal.toFixed(2)}`)
  
  if (Math.abs(totalDebitBal - totalCreditBal) < 0.01) {
    console.log('SUCCESS: Ledger balances perfectly! Total Debits equal Total Credits.')
  } else {
    console.error('ERROR: Ledger is out of balance!')
  }
}

main()
  .finally(() => prisma.$disconnect())
