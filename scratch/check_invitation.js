const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const invitation = await prisma.invitation.findUnique({
        where: { slug: 'sela-dan-didin' },
        include: { theme: true }
    });
    console.log(JSON.stringify(invitation, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
