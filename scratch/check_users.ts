import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log("Total Users:", users.length);
    users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));
}

main().finally(() => prisma.$disconnect());
