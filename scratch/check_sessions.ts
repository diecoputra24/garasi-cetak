import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const sessions = await prisma.session.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 5
    });
    console.log(`Total Sessions: ${await prisma.session.count()}`);
    sessions.forEach(s => {
        console.log(`- User: ${s.user.email}, Token: ${s.token.substring(0, 10)}..., Expires: ${s.expiresAt}`);
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
