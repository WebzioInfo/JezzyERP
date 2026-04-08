import { PrismaClient } from './src/db/generated/client/index.js'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  console.log(`Product Count: ${count}`)
  
  const sample = await prisma.product.findFirst({
    where: { sku: 'PET-188' }
  })
  
  if (sample) {
    console.log('Sample Product Found:')
    console.log(`- Description: ${sample.description}`)
    console.log(`- Purchase Rate: ${sample.purchaseRate}`)
    console.log(`- Selling Rate: ${sample.sellingRate}`)
  } else {
    console.log('Sample Product NOT found')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
