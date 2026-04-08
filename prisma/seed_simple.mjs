import { PrismaClient } from '../src/db/generated/client/index.js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: (process.env.DATABASE_URL || "mysql://db46959:WebzioWeb@db46959.public.databaseasp.net:3306/db46959") + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=45'
    }
  }
})

async function main() {
  const email = 'admin@jezzy.com'
  const hashedPassword = await bcrypt.hash('admin123', 10)

  console.log(`Seeding Admin: ${email}...`)
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Admin User',
        passwordHash: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log(`User created: ${user.email}`)
  } catch (e) {
    console.log('User already exists or error occurred: ', e.message)
  }

  try {
    const settings = await prisma.companySetting.upsert({
      where: { id: 'default-settings' },
      update: {
        companyName: "JEZZY ENTERPRISES",
        gstin: "32BMAPJ5504M1Z9",
        address1: "MP 4/3 IIA, MOONIYUR",
        address2: "VELIMUKKU PO, MALAPPURAM DIST",
        city: "Malappuram",
        pincode: "676317",
        phone: "+91 85531 85300",
        email: "jezzyenterprises@gmail.com",
        bankName: "FEDERAL BANK",
        bankBranch: "CHELARI",
        bankAccountNo: "16470200011150 ",
        bankIfsc: "FDRL0001647",
        bankAccountName: "JEZZY ENTERPRISES",
        showPkgDetails: true
      },
      create: {
        id: 'default-settings',
        companyName: "JEZZY ENTERPRISES",
        gstin: "32BMAPJ5504M1Z9",
        address1: "MP 4/3 IIA, MOONIYUR",
        address2: "VELIMUKKU PO, MALAPPURAM DIST",
        city: "Malappuram",
        pincode: "676317",
        phone: "+91 85531 85300",
        email: "jezzyenterprises@gmail.com",
        bankName: "FEDERAL BANK",
        bankBranch: "CHELARI",
        bankAccountNo: "16470200011150 ",
        bankIfsc: "FDRL0001647",
        bankAccountName: "JEZZY ENTERPRISES",
        showPkgDetails: true
      }
    })
    console.log('Company settings synchronized')
  } catch (e) {
     console.log('Settings error: ', e.message)
  }

  const products = [
    { sku: "PET-188", description: "Pet Preforms(28mmx18.8gms) Alaska-Kgs", hsn: "39239090", purchaseRate: "160.00", sellingRate: "175.00", gstRate: "18", unit: "KGS", pkgType: "BOX" },
    { sku: "PET-196", description: "Pet Preforms(28mmx19.6gms) Alaska-Kgs", hsn: "39239090", purchaseRate: "160.00", sellingRate: "175.00", gstRate: "18", unit: "KGS", pkgType: "BOX" },
    { sku: "PET-130", description: "Pet Preforms(28mmx13gms) Alaska-Kgs", hsn: "39239090", purchaseRate: "160.00", sellingRate: "175.00", gstRate: "18", unit: "KGS", pkgType: "BOX" },
    { sku: "CAP-BLUE", description: "27mm Alaska K Blue Caps", hsn: "39235010", purchaseRate: "0.35", sellingRate: "0.45", gstRate: "18", unit: "NOS", pkgType: "BAG" },
    { sku: "CAP-WHITE", description: "27MM ALASKA WHITE CAPS", hsn: "39235010", purchaseRate: "0.35", sellingRate: "0.45", gstRate: "18", unit: "NOS", pkgType: "BAG" },
    { sku: "CAP-DOME", description: "26mm Alaska SN White caps (DOME)", hsn: "39235010", purchaseRate: "0.35", sellingRate: "0.45", gstRate: "18", unit: "NOS", pkgType: "BAG" },
    { sku: "SHRINK-ROLL", description: "Shrink Roll", hsn: "39011020", purchaseRate: "173.00", sellingRate: "190.00", gstRate: "18", unit: "KG", pkgType: "ROLL" },
  ]

  for (const p of products) {
    try {
      await prisma.product.upsert({
        where: { sku: p.sku },
        update: p,
        create: p
      })
      console.log(`Product synced: ${p.sku}`)
    } catch (e) {
      console.log(`Error syncing product ${p.sku}: ${e.message}`)
    }
  }
}

main()
  .catch((e) => {
    console.error('Fatal Seed Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
