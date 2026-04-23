import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.companySetting.findFirst()
  if (settings) {
    console.log('Updating existing settings...')
    await prisma.companySetting.update({
      where: { id: settings.id },
      data: {
        invoicePrefix: 'B2B'
      }
    })
  } else {
    console.log('Creating new settings...')
    await prisma.companySetting.create({
      data: {
        companyName: 'JEZZY ENTERPRISES',
        gstin: '32BMAPJ5504M1Z9',
        address1: 'MP 4/3 IIA, MOONIYUR',
        address2: 'VELIMUKKU PO, MALAPPURAM DIST',
        city: 'Malappuram',
        state: 'Kerala',
        pincode: '676317',
        phone: '+91 85531 85300',
        email: 'jezzyenterprises@gmail.com',
        bankAccountName: 'JEZZY ENTERPRISES',
        bankName: 'FEDERAL BANK',
        bankBranch: 'CHELARI',
        bankAccountNo: '16470200011150',
        bankIfsc: 'FDRL0001647',
        invoicePrefix: 'JE-B2B'
      }
    })
  }
  console.log('Settings updated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
