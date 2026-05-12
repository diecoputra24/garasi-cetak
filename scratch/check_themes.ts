import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const themes = await prisma.theme.findMany();
  console.log('Themes in DB:', themes);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
