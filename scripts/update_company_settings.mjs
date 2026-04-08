import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.companySetting.findFirst();
  
  const newData = {
    companyName: "JEZZY ENTERPRISES",
    gstin: "32BMAPJ5504M1Z9",
    address1: "MP 4/3 IIA, MOONIYUR",
    address2: "VELIMUKKU PO, MALAPPURAM DIST",
    city: "Malappuram",
    state: "Kerala",
    pincode: "676317",
    phone: "+91 85531 85300",
    email: "jezzyenterprises@gmail.com",
    bankAccountName: "JEZZY ENTERPRISES",
  };

  if (settings) {
    console.log("Updating existing company settings...");
    await prisma.companySetting.update({
      where: { id: settings.id },
      data: newData,
    });
  } else {
    console.log("Creating new company settings...");
    await prisma.companySetting.create({
      data: newData,
    });
  }
  
  console.log("Company settings updated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
