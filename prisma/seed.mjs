import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=30'
    }
  }
})

async function main() {
  const email = 'admin@jezzy.com'
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log(`Seeding user: ${email}...`)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN'
    },
    create: {
      email,
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log(`User seeded: ${user.email} (ID: ${user.id})`)

  const aliEmail = 'ali@jezzy.com'
  const aliPassword = 'ali123'
  const aliHashedPassword = await bcrypt.hash(aliPassword, 10)

  console.log(`Seeding user: ${aliEmail}...`)

  const aliUser = await prisma.user.upsert({
    where: { email: aliEmail },
    update: {
      passwordHash: aliHashedPassword,
      role: 'ADMIN'
    },
    create: {
      email: aliEmail,
      name: 'Ali',
      passwordHash: aliHashedPassword,
      role: 'ADMIN'
    }
  })

  console.log(`User seeded: ${aliUser.email} (ID: ${aliUser.id})`)

  // --- Seed Company Settings ---
  console.log('Seeding company settings...')
  const settings = await prisma.companySetting.upsert({
    where: { id: 'default-settings' },
    update: {},
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
  console.log(`Company settings seeded: ${settings.companyName}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
