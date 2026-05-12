const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const id = "cmnvliv2o000huu1kblut1ulc"; // ID dari log Anda
  const inv = await prisma.$queryRawUnsafe(`SELECT * FROM "invitation" WHERE "id" = ?`, id);
  console.log("DATA UNDANGAN:");
  console.log(JSON.stringify(inv[0], null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
