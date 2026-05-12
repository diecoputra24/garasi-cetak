import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const themes = [
    { id: "modern-floral-red", name: "Modern Floral Red", slug: "modern-floral-red" },
    { id: "rustic-elegance", name: "Rustic Elegance", slug: "rustic-elegance" },
    { id: "blue-modern-floral", name: "Blue Modern Floral", slug: "blue-modern-floral" },
  ];

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { id: theme.id },
      update: theme,
      create: theme,
    });
  }
  
  console.log('Themes seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
