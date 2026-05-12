const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const invitation = await prisma.invitation.findUnique({
    where: { slug: 'sela-dan-didin' },
  });
  console.log(JSON.stringify(invitation, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
