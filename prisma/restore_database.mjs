import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  console.log('Starting full database recovery and seed for JEZZY ENTERPRISES...')

  // 1. Safe ordered cleanup of tables to avoid foreign key violations
  console.log('Cleaning up existing database records...')
  const cleanupSequence = [
    'paymentAllocation',
    'payment',
    'invoiceLineItem',
    'invoice',
    'ledgerEntry',
    'account',
    'stockLog',
    'stock',
    'product',
    'client',
    'companySetting',
    'user'
  ]

  for (const modelName of cleanupSequence) {
    try {
      await prisma[modelName].deleteMany()
      console.log(`Cleared model: ${modelName}`)
    } catch (e) {
      console.log(`Note on clearing ${modelName}: ${e.message}`)
    }
  }

  // 2. Hash passwords for users
  const hashedUserPassword = await bcrypt.hash('Password@123', 10)
  const hashedAdminCom = await bcrypt.hash('admin@123', 10)
  const hashedAliCom = await bcrypt.hash('ali@123', 10)

  // 3. Seed Users
  console.log('Seeding users...')
  const users = [
    {
      id: 'usr-superadmin',
      email: 'superadmin@jezzy.local',
      name: 'Super Admin',
      passwordHash: hashedUserPassword,
      role: 'SUPER_ADMIN'
    },
    {
      id: 'usr-admin-local',
      email: 'admin@jezzy.local',
      name: 'Admin Local',
      passwordHash: hashedUserPassword,
      role: 'ADMIN'
    },
    {
      id: 'usr-admin-com',
      email: 'admin@jezzy.com',
      name: 'Admin Main',
      passwordHash: hashedAdminCom,
      role: 'ADMIN'
    },
    {
      id: 'usr-ali',
      email: 'ali@jezzy.com',
      name: 'Ali',
      passwordHash: hashedAliCom,
      role: 'ADMIN'
    },
    {
      id: 'usr-accountant',
      email: 'accountant@jezzy.local',
      name: 'Accountant',
      passwordHash: hashedUserPassword,
      role: 'ACCOUNTANT'
    },
    {
      id: 'usr-manager',
      email: 'manager@jezzy.local',
      name: 'Manager',
      passwordHash: hashedUserPassword,
      role: 'MANAGER'
    },
    {
      id: 'usr-staff',
      email: 'staff@jezzy.local',
      name: 'Staff',
      passwordHash: hashedUserPassword,
      role: 'STAFF'
    }
  ]

  for (const u of users) {
    await prisma.user.create({ data: u })
  }
  console.log(`Seeded ${users.length} users successfully.`)

  // 4. Seed Company Settings
  console.log('Seeding company settings...')
  await prisma.companySetting.create({
    data: {
      id: 'default-settings',
      companyId: 'jezzy-enterprises',
      companyName: 'JEZZY ENTERPRISES',
      gstin: '32BMAPJ5504M1Z9',
      address1: 'MP 4/3 IIA, MOONIYUR',
      address2: 'VELIMUKKU PO, MALAPPURAM DIST',
      city: 'Malappuram',
      state: 'Kerala',
      pincode: '676317',
      phone: '+91 85531 85300',
      email: 'jezzyenterprises@gmail.com',
      bankName: 'FEDERAL BANK',
      bankBranch: 'CHELARI',
      bankAccountNo: '16470200011150 ',
      bankIfsc: 'FDRL0001647',
      bankAccountName: 'JEZZY ENTERPRISES',
      invoicePrefix: 'B2B',
      quotationPrefix: 'QUO',
      defaultGstType: 'CGST_SGST',
      currency: 'INR',
      showPkgDetails: true,
      showLogo: false
    }
  })

  // 5. Seed Products & Stocks
  console.log('Seeding products and stock levels...')
  const products = [
    { sku: 'SHRINK-ROLL', description: 'Shrink Rolls (Plastic shrink rolls)', hsn: '39011029', purchaseRate: 175.00, sellingRate: 195.00, gstRate: 18.00, unit: 'KGS', pkgType: 'ROLL', stock: 57.000 },
    { sku: 'SHRINK-580', description: 'Shrink Rolls 580MM', hsn: '39011020', purchaseRate: 155.00, sellingRate: 173.00, gstRate: 18.00, unit: 'KGS', pkgType: 'ROLL', stock: 525.100 },
    { sku: 'SHRINK-500', description: 'Shrink Rolls 500MM', hsn: '39011020', purchaseRate: 155.00, sellingRate: 173.00, gstRate: 18.00, unit: 'KGS', pkgType: 'ROLL', stock: 516.200 },
    { sku: 'CAP-WHITE-27', description: '27MM Alaska White Caps', hsn: '39235010', purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: 'NOS', pkgType: 'BAG', stock: 720000.000 },
    { sku: 'CAP-WHITE-26D', description: '26MM Alaska SN White Caps (Dome)', hsn: '39235010', purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: 'NOS', pkgType: 'BAG', stock: 50000.000 },
    { sku: 'PET-13G', description: 'PET Preforms 13G (28mm x 13g Alaska)', hsn: '39239090', purchaseRate: 145.00, sellingRate: 160.00, gstRate: 18.00, unit: 'KGS', pkgType: 'BOX', stock: 425.000 },
    { sku: 'CAP-BLUE-27', description: '27MM Alaska D Blue Caps', hsn: '39235010', purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: 'NOS', pkgType: 'BAG', stock: 160000.000 },
    { sku: 'CAP-WHITE-26F', description: '26MM Alaska SN White Caps (Flat)', hsn: '39235010', purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: 'NOS', pkgType: 'BAG', stock: 240000.000 },
    { sku: 'PET-18.8G', description: 'PET Preforms 18.8G (28mm x 18.8g Alaska)', hsn: '39239090', purchaseRate: 145.00, sellingRate: 160.00, gstRate: 18.00, unit: 'KGS', pkgType: 'BOX', stock: 875.000 }
  ]

  for (const p of products) {
    const prodId = 'prod-' + p.sku.toLowerCase()
    await prisma.product.create({
      data: {
        id: prodId,
        companyId: 'jezzy-enterprises',
        sku: p.sku,
        description: p.description,
        hsn: p.hsn,
        gstRate: p.gstRate,
        unit: p.unit,
        pkgType: p.pkgType,
        purchaseRate: p.purchaseRate,
        sellingRate: p.sellingRate,
        qtyPerBox: 0,
        active: true
      }
    })

    await prisma.stock.create({
      data: {
        id: 'stock-' + prodId,
        productId: prodId,
        quantity: p.stock
      }
    })

    await prisma.stockLog.create({
      data: {
        companyId: 'jezzy-enterprises',
        productId: prodId,
        type: 'MANUAL',
        quantityBefore: 0.000,
        quantityChange: p.stock,
        quantityAfter: p.stock,
        notes: 'Opening Stock'
      }
    })
  }

  // 6. Seed Clients
  console.log('Seeding clients...')
  const clients = [
    { id: 'client-gangothri', name: 'Gangothri Aqua Proccessing Unit', address1: 'Kokkur po, Changarakulam', address2: 'Malappuram DIST', state: 'Kerala', pinCode: '679591', gst: '32BPWPP4597K1ZW', phone: null, email: null },
    { id: 'client-spellbound', name: 'SPELL BOUND EQUALITY PDW', address1: '03/261-A-PERUKULAM, MARAKKARA', address2: 'RANDATHANI, MALAPPURAM', state: 'Kerala', pinCode: '676510', gst: '32CGHPK7926C1ZK', phone: null, email: null },
    { id: 'client-diamond', name: 'DIAMOND PET PRODUCTS', address1: 'KOKKUR PO, CHANGARAKULAM', address2: 'MALAPPURAM', state: 'Kerala', pinCode: '676591', gst: '32AZGPD8827M1Z4', phone: null, email: null },
    { id: 'client-faiha', name: 'FAIHA WATER SOLUTIONS & H20 DRINKS', address1: '11/655/AV, Manjeri Road', address2: 'Kunnummal, Malappuram', state: 'Kerala', pinCode: '676541', gst: '32AAHFF4941L2ZB', phone: '+91 8848530725', email: null },
    { id: 'client-essar', name: 'ESSAR ENTERPRISES', address1: 'SITE NO.9, SEEGAHALLI VILLAGE, KR PURAM HOBLI', address2: 'BANGALORE', state: 'Karnataka', pinCode: '560049', gst: '29AOPPM7487J1ZV', phone: null, email: 'essarwater.info@gmail.com' },
    { id: 'client-bridge', name: 'BRIDGE DROPS PVT LTD', address1: 'VP/1/152-ABC, VAZHAKKAD', address2: 'OORKADAVU, AKODE PO', state: 'Kerala', pinCode: '673640', gst: '32AAICB1883B1Z3', phone: null, email: null },
    { id: 'client-eranad', name: 'ERANAD BEVERAGES PVT LTD', address1: 'PAVANNA, URANGATTIRI', address2: 'POOVATHIKKAL', state: 'Kerala', pinCode: '673639', gst: '32AAECE2265N1ZL', phone: null, email: null }
  ]

  for (const c of clients) {
    await prisma.client.create({
      data: {
        id: c.id,
        companyId: 'jezzy-enterprises',
        name: c.name,
        gst: c.gst,
        email: c.email,
        phone: c.phone,
        address1: c.address1,
        address2: c.address2,
        state: c.state,
        pinCode: c.pinCode,
        active: true
      }
    })
  }

  // 7. Seed Financial Accounts (Double Entry Charts)
  console.log('Seeding chart of accounts...')
  const systemAccounts = [
    { id: 'acc-cash', name: 'System CASH Account', type: 'CASH' },
    { id: 'acc-bank', name: 'System BANK Account', type: 'BANK' },
    { id: 'acc-revenue', name: 'System REVENUE Account', type: 'REVENUE' },
    { id: 'acc-expense', name: 'System EXPENSE Account', type: 'EXPENSE' },
    { id: 'acc-purchase', name: 'System PURCHASE Account', type: 'PURCHASE' }
  ]

  for (const acc of systemAccounts) {
    await prisma.account.create({
      data: {
        id: acc.id,
        companyId: 'jezzy-enterprises',
        name: acc.name,
        type: acc.type,
        active: true
      }
    })
  }

  // Seed Client Receivable Accounts
  for (const c of clients) {
    await prisma.account.create({
      data: {
        id: 'acc-client-' + c.id.replace('client-', ''),
        companyId: 'jezzy-enterprises',
        name: 'Receivable: ' + c.name,
        type: 'CLIENT',
        clientId: c.id,
        active: true
      }
    })
  }

  // 8. Seed Invoices
  console.log('Seeding sequential invoices...')
  const invoicesData = [
    {
      id: 'inv-01',
      clientId: 'client-eranad',
      sequenceNumber: 1,
      invoiceNo: 'JE/B2B/01/26-27',
      date: new Date('2026-04-01T10:00:00Z'),
      subTotal: 11115.00,
      taxTotal: 2000.70,
      grandTotal: 13116.00,
      status: 'SENT',
      items: [
        { productId: 'prod-shrink-roll', description: 'Shrink Rolls (Plastic shrink rolls)', hsn: '39011029', qty: 57.000, rate: 195.00, taxPercent: 18.00, taxAmount: 2000.70, totalAmount: 11115.00 }
      ]
    },
    {
      id: 'inv-02',
      clientId: 'client-eranad',
      sequenceNumber: 2,
      invoiceNo: 'JE/B2B/02/26-27',
      date: new Date('2026-04-08T10:00:00Z'),
      subTotal: 186444.50,
      taxTotal: 33560.01,
      grandTotal: 220005.00,
      status: 'SENT',
      items: [
        { productId: 'prod-shrink-roll', description: 'Shrink Rolls (Plastic shrink rolls)', hsn: '39011029', qty: 560.000, rate: 195.00, taxPercent: 18.00, taxAmount: 19656.00, totalAmount: 109200.00 },
        { productId: 'prod-shrink-580', description: 'Shrink Rolls 580MM', hsn: '39011020', qty: 446.500, rate: 173.00, taxPercent: 18.00, taxAmount: 13904.01, totalAmount: 77244.50 }
      ]
    },
    {
      id: 'inv-03',
      clientId: 'client-diamond',
      sequenceNumber: 3,
      invoiceNo: 'JE/B2B/03/26-27',
      date: new Date('2026-04-12T10:00:00Z'),
      subTotal: 80000.00,
      taxTotal: 14400.00,
      grandTotal: 94400.00,
      status: 'SENT',
      items: [
        { productId: 'prod-pet-13g', description: 'PET Preforms 13G (28mm x 13g Alaska)', hsn: '39239090', qty: 500.000, rate: 160.00, taxPercent: 18.00, taxAmount: 14400.00, totalAmount: 80000.00 }
      ]
    },
    {
      id: 'inv-04',
      clientId: 'client-faiha',
      sequenceNumber: 4,
      invoiceNo: 'JE/B2B/04/26-27',
      date: new Date('2026-04-18T10:00:00Z'),
      subTotal: 40000.00,
      taxTotal: 7200.00,
      grandTotal: 47200.00,
      status: 'SENT',
      items: [
        { productId: 'prod-pet-18.8g', description: 'PET Preforms 18.8G (28mm x 18.8g Alaska)', hsn: '39239090', qty: 250.000, rate: 160.00, taxPercent: 18.00, taxAmount: 7200.00, totalAmount: 40000.00 }
      ]
    },
    {
      id: 'inv-05',
      clientId: 'client-eranad',
      sequenceNumber: 5,
      invoiceNo: 'JE/B2B/05/26-27',
      date: new Date('2026-04-23T10:00:00Z'),
      subTotal: 39200.00,
      taxTotal: 7056.00,
      grandTotal: 46256.00,
      status: 'SENT',
      items: [
        { productId: 'prod-cap-white-27', description: '27MM Alaska White Caps', hsn: '39235010', qty: 112000.000, rate: 0.35, taxPercent: 18.00, taxAmount: 7056.00, totalAmount: 39200.00 }
      ]
    },
    {
      id: 'inv-06',
      clientId: 'client-spellbound',
      sequenceNumber: 6,
      invoiceNo: 'JE/B2B/06/26-27',
      date: new Date('2026-04-24T09:00:00Z'),
      subTotal: 50000.00,
      taxTotal: 9000.00,
      grandTotal: 59000.00,
      status: 'SENT',
      items: [
        { productId: 'prod-cap-blue-27', description: '27MM Alaska D Blue Caps', hsn: '39235010', qty: 100000.000, rate: 0.35, taxPercent: 18.00, taxAmount: 6300.00, totalAmount: 35000.00 },
        { productId: 'prod-pet-13g', description: 'PET Preforms 13G (28mm x 13g Alaska)', hsn: '39239090', qty: 93.750, rate: 160.00, taxPercent: 18.00, taxAmount: 2700.00, totalAmount: 15000.00 }
      ]
    },
    {
      id: 'inv-07',
      clientId: 'client-eranad',
      sequenceNumber: 7,
      invoiceNo: 'JE/B2B/07/26-27',
      date: new Date('2026-04-24T15:00:00Z'),
      subTotal: 308000.00,
      taxTotal: 55440.00,
      grandTotal: 363440.00,
      status: 'SENT',
      items: [
        { productId: 'prod-cap-white-27', description: '27MM Alaska White Caps', hsn: '39235010', qty: 880000.000, rate: 0.35, taxPercent: 18.00, taxAmount: 55440.00, totalAmount: 308000.00 }
      ]
    },
    {
      id: 'inv-08',
      clientId: 'client-gangothri',
      sequenceNumber: 8,
      invoiceNo: 'JE/B2B/08/26-27',
      date: new Date('2026-04-27T10:00:00Z'),
      subTotal: 28000.00,
      taxTotal: 5040.00,
      grandTotal: 33040.00,
      status: 'SENT',
      items: [
        { productId: 'prod-cap-white-27', description: '27MM Alaska White Caps', hsn: '39235010', qty: 80000.000, rate: 0.35, taxPercent: 18.00, taxAmount: 5040.00, totalAmount: 28000.00 }
      ]
    },
    {
      id: 'inv-09',
      clientId: 'client-gangothri',
      sequenceNumber: 9,
      invoiceNo: 'JE/B2B/09/26-27',
      date: new Date('2026-05-01T09:00:00Z'),
      subTotal: 64419.50,
      taxTotal: 11595.51,
      grandTotal: 76015.00,
      status: 'SENT',
      items: [
        { productId: 'prod-shrink-580', description: 'Shrink Rolls 580MM', hsn: '39011020', qty: 121.500, rate: 173.00, taxPercent: 18.00, taxAmount: 3783.51, totalAmount: 21019.50 },
        { productId: 'prod-cap-white-27', description: '27MM Alaska White Caps', hsn: '39235010', qty: 124000.000, rate: 0.35, taxPercent: 18.00, taxAmount: 7812.00, totalAmount: 43400.00 }
      ]
    },
    {
      id: 'inv-10',
      clientId: 'client-spellbound',
      sequenceNumber: 10,
      invoiceNo: 'JE/B2B/10/26-27',
      date: new Date('2026-05-01T15:00:00Z'),
      subTotal: 11624.50,
      taxTotal: 2092.41,
      grandTotal: 13717.00,
      status: 'SENT',
      items: [
        { productId: 'prod-shrink-580', description: 'Shrink Rolls 580MM', hsn: '39011020', qty: 6.500, rate: 173.00, taxPercent: 18.00, taxAmount: 202.41, totalAmount: 1124.50 },
        { productId: 'prod-cap-white-27', description: '27MM Alaska White Caps', hsn: '39235010', qty: 30000.000, rate: 0.35, taxPercent: 18.00, taxAmount: 1890.00, totalAmount: 10500.00 }
      ]
    }
  ]

  for (const inv of invoicesData) {
    const clientData = clients.find(c => c.id === inv.clientId)
    
    // Create the invoice structure
    await prisma.invoice.create({
      data: {
        id: inv.id,
        companyId: 'jezzy-enterprises',
        clientId: inv.clientId,
        sequenceNumber: inv.sequenceNumber,
        invoiceNo: inv.invoiceNo,
        date: inv.date,
        gstType: 'CGST_SGST',
        subTotal: inv.subTotal,
        taxTotal: inv.taxTotal,
        grandTotal: inv.grandTotal,
        status: inv.status,
        isFinalized: true,
        billingName: clientData.name,
        billingAddress1: clientData.address1,
        billingAddress2: clientData.address2,
        billingState: clientData.state,
        billingPinCode: clientData.pinCode,
        billingGst: clientData.gst,
        shippingSameAsBilling: true,
        shippingName: clientData.name,
        shippingAddress1: clientData.address1,
        shippingAddress2: clientData.address2,
        shippingState: clientData.state,
        shippingPinCode: clientData.pinCode,
        lineItems: {
          create: inv.items.map(item => ({
            productId: item.productId,
            description: item.description,
            hsn: item.hsn,
            qty: item.qty,
            rate: item.rate,
            taxPercent: item.taxPercent,
            taxAmount: item.taxAmount,
            totalAmount: item.totalAmount
          }))
        }
      }
    })

    // Ledger Entry (Double Entry Sales Posting)
    // Debit Client Account, Credit Sales Account
    const clientAccId = 'acc-client-' + inv.clientId.replace('client-', '')
    
    await prisma.ledgerEntry.create({
      data: {
        debitAccountId: clientAccId,
        creditAccountId: 'acc-revenue',
        amount: inv.grandTotal,
        date: inv.date,
        referenceType: 'INVOICE',
        referenceId: inv.id,
        description: `Sales Invoice ${inv.invoiceNo}`
      }
    })

    console.log(`Seeded Invoice: ${inv.invoiceNo}`)
  }

  // 9. Seed Payments
  console.log('Seeding payments...')
  const paymentsData = [
    {
      id: 'pay-eranad',
      clientId: 'client-eranad',
      amount: 300000.00,
      paidAt: new Date('2026-04-03T10:00:00Z'),
      method: 'BANK_TRANSFER',
      reference: 'cmoqcj9v10008i89kljsmgfew',
      notes: 'Payment received from Eranad Beverages'
    },
    {
      id: 'pay-spellbound',
      clientId: 'client-spellbound',
      amount: 59000.00,
      paidAt: new Date('2026-04-25T10:00:00Z'),
      method: 'BANK_TRANSFER',
      reference: 'ref-spellbound-01',
      notes: 'Payment received for Invoice 06'
    }
  ]

  for (const pay of paymentsData) {
    await prisma.payment.create({
      data: {
        id: pay.id,
        companyId: 'jezzy-enterprises',
        clientId: pay.clientId,
        amount: pay.amount,
        paidAt: pay.paidAt,
        method: pay.method,
        reference: pay.reference,
        notes: pay.notes
      }
    })

    // Double entry Ledger Posting: Debit Bank Account, Credit Client account
    const clientAccId = 'acc-client-' + pay.clientId.replace('client-', '')
    await prisma.ledgerEntry.create({
      data: {
        debitAccountId: 'acc-bank',
        creditAccountId: clientAccId,
        amount: pay.amount,
        date: pay.paidAt,
        referenceType: 'PAYMENT',
        referenceId: pay.id,
        description: `Payment Received via ${pay.method} (Ref: ${pay.reference})`
      }
    })

    console.log(`Seeded Payment: ${pay.id} for client: ${pay.clientId}`)
  }

  // 10. Seed Payment Allocations
  console.log('Seeding payment allocations...')
  const allocationsData = [
    // Eranad allocations
    { id: 'alloc-eranad-inv-01', paymentId: 'pay-eranad', invoiceId: 'inv-01', amount: 13116.00 },
    { id: 'alloc-eranad-inv-02', paymentId: 'pay-eranad', invoiceId: 'inv-02', amount: 220005.00 },
    { id: 'alloc-eranad-inv-05', paymentId: 'pay-eranad', invoiceId: 'inv-05', amount: 46256.00 },
    { id: 'alloc-eranad-inv-07', paymentId: 'pay-eranad', invoiceId: 'inv-07', amount: 20623.00 },
    // Spell Bound allocations
    { id: 'alloc-spellbound-inv-06', paymentId: 'pay-spellbound', invoiceId: 'inv-06', amount: 59000.00 }
  ]

  for (const alloc of allocationsData) {
    await prisma.paymentAllocation.create({
      data: alloc
    })
  }

  // 11. Sync Invoice Statuses based on allocations
  console.log('Synchronizing invoice statuses...')
  const invoiceStatuses = [
    { id: 'inv-01', status: 'PAID' },
    { id: 'inv-02', status: 'PAID' },
    { id: 'inv-03', status: 'SENT' },
    { id: 'inv-04', status: 'SENT' },
    { id: 'inv-05', status: 'PAID' },
    { id: 'inv-06', status: 'PAID' },
    { id: 'inv-07', status: 'PARTIAL' },
    { id: 'inv-08', status: 'SENT' },
    { id: 'inv-09', status: 'SENT' },
    { id: 'inv-10', status: 'SENT' }
  ]

  for (const inv of invoiceStatuses) {
    await prisma.invoice.update({
      where: { id: inv.id },
      data: { status: inv.status }
    })
  }

  console.log('Database restoration completed successfully!')
}

main()
  .catch((e) => {
    console.error('Database Restoration Failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
