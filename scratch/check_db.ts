import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const invitations = await prisma.$queryRawUnsafe(`
    SELECT "id", "slug", "views" FROM "invitation"
  `);
  console.log("=== DATABASE AUDIT ===");
  console.table(invitations);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
