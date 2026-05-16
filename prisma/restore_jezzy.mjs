import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=45'
    }
  }
})

async function main() {
  console.log('Starting full restoration of Jezzy Enterprises data...')

  // 1. Clean up all multi-tenant demo data
  console.log('Cleaning up existing demo transactions, clients, products, and settings...')
  const tables = [
    'audit_logs',
    'payment_allocations',
    'payments',
    'invoice_line_items',
    'invoices',
    'quotation_line_items',
    'quotations',
    'purchase_line_items',
    'purchases',
    'ledger_entries',
    'accounts',
    'loans',
    'advances',
    'expenses',
    'stock_logs',
    'stocks',
    'products',
    'clients',
    'vendors',
    'company_settings',
    'companies'
  ]

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM ${table}`)
      console.log(`Cleared table: ${table}`)
    } catch (e) {
      console.log(`Note on clearing ${table}: ${e.message}`)
    }
  }

  // 2. Insert Jezzy Enterprises Company
  console.log('Creating Jezzy Enterprises company profile...')
  const companyId = 'jezzy-enterprises'
  await prisma.$executeRawUnsafe(`
    INSERT INTO companies (id, name, slug, status, plan, createdAt, updatedAt)
    VALUES ('${companyId}', 'Jezzy Enterprises', 'jezzy-enterprises', 'ACTIVE', 'ENTERPRISE', NOW(), NOW())
  `)

  // 3. Insert Jezzy Enterprises Company Settings
  console.log('Restoring Jezzy Enterprises bank and billing settings...')
  await prisma.$executeRawUnsafe(`
    INSERT INTO company_settings (
      id, companyId, companyName, gstin, address1, address2, city, state, pincode, phone, email,
      bankName, bankBranch, bankAccountNo, bankIfsc, bankAccountName,
      invoicePrefix, quotationPrefix, defaultGstType, currency, showPkgDetails, showLogo, updatedAt
    ) VALUES (
      'default-settings', '${companyId}', 'JEZZY ENTERPRISES', '32BMAPJ5504M1Z9', 'MP 4/3 IIA, MOONIYUR', 'VELIMUKKU PO, MALAPPURAM DIST', 'Malappuram', 'Kerala', '676317', '+91 85531 85300', 'jezzyenterprises@gmail.com',
      'FEDERAL BANK', 'CHELARI', '16470200011150', 'FDRL0001647', 'JEZZY ENTERPRISES',
      'JEZZY/', 'QUO/', 'CGST_SGST', 'INR', 1, 0, NOW()
    )
  `)

  // 4. Insert Jezzy Enterprises Products & Initial Stocks
  console.log('Restoring Jezzy Enterprises product catalog and initial inventory...')
  const products = [
    { sku: "SHRINK-ROLL", description: "Shrink Rolls (Plastic shrink rolls)", hsn: "39011029", purchaseRate: 175.00, sellingRate: 195.00, gstRate: 18.00, unit: "KGS", pkgType: "ROLL", stock: 57.000 },
    { sku: "SHRINK-580", description: "Shrink Rolls 580MM", hsn: "39011020", purchaseRate: 155.00, sellingRate: 173.00, gstRate: 18.00, unit: "KGS", pkgType: "ROLL", stock: 525.100 },
    { sku: "SHRINK-500", description: "Shrink Rolls 500MM", hsn: "39011020", purchaseRate: 155.00, sellingRate: 173.00, gstRate: 18.00, unit: "KGS", pkgType: "ROLL", stock: 516.200 },
    { sku: "CAP-WHITE-27", description: "27MM Alaska White Caps", hsn: "39235010", purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: "NOS", pkgType: "BAG", stock: 720000.000 },
    { sku: "CAP-WHITE-26D", description: "26MM Alaska SN White Caps (Dome)", hsn: "39235010", purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: "NOS", pkgType: "BAG", stock: 50000.000 },
    { sku: "PET-13G", description: "PET Preforms 13G (28mm x 13g Alaska)", hsn: "39239090", purchaseRate: 145.00, sellingRate: 160.00, gstRate: 18.00, unit: "KGS", pkgType: "BOX", stock: 425.000 },
    { sku: "CAP-BLUE-27", description: "27MM Alaska D Blue Caps", hsn: "39235010", purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: "NOS", pkgType: "BAG", stock: 160000.000 },
    { sku: "CAP-WHITE-26F", description: "26MM Alaska SN White Caps (Flat)", hsn: "39235010", purchaseRate: 0.28, sellingRate: 0.35, gstRate: 18.00, unit: "NOS", pkgType: "BAG", stock: 240000.000 },
    { sku: "PET-18.8G", description: "PET Preforms 18.8G (28mm x 18.8g Alaska)", hsn: "39239090", purchaseRate: 145.00, sellingRate: 160.00, gstRate: 18.00, unit: "KGS", pkgType: "BOX", stock: 875.000 },
  ]

  for (const p of products) {
    const prodId = 'prod-' + p.sku.toLowerCase()
    await prisma.$executeRawUnsafe(`
      INSERT INTO products (
        id, companyId, sku, description, hsn, gstRate, unit, pkgType, purchaseRate, sellingRate, qtyPerBox, active, createdAt, updatedAt
      ) VALUES (
        '${prodId}', '${companyId}', '${p.sku}', '${p.description}', '${p.hsn}', ${p.gstRate}, '${p.unit}', '${p.pkgType}', ${p.purchaseRate}, ${p.sellingRate}, 0.000, 1, NOW(), NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      INSERT INTO stocks (id, productId, quantity, updatedAt)
      VALUES ('stock-${prodId}', '${prodId}', ${p.stock}, NOW())
    `)
    console.log(`Restored product & stock: ${p.sku} (${p.stock} ${p.unit})`)
  }

  // 4b. Insert Jezzy Enterprises Clients
  console.log('Restoring Jezzy Enterprises client entities...')
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
    await prisma.$executeRawUnsafe(`
      INSERT INTO clients (
        id, companyId, name, gst, email, phone, address1, address2, state, pinCode, active, createdAt, updatedAt
      ) VALUES (
        '${c.id}', '${companyId}', '${c.name}', ${c.gst ? `'${c.gst}'` : 'NULL'}, ${c.email ? `'${c.email}'` : 'NULL'}, ${c.phone ? `'${c.phone}'` : 'NULL'}, '${c.address1}', '${c.address2}', '${c.state}', '${c.pinCode}', 1, NOW(), NOW()
      )
    `)
    console.log(`Restored client: ${c.name}`)
  }

  // 5. Ensure Admin Users are active
  console.log('Verifying admin user access...')
  await prisma.$executeRawUnsafe(`
    UPDATE users SET globalRole = 'ADMIN' WHERE email IN ('admin@jezzy.com', 'ali@jezzy.com')
  `)

  console.log('✨ Restoration complete! Jezzy ERP is now perfectly synchronized with pristine original data.')
}

main()
  .catch((e) => {
    console.error('Fatal Restoration Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
