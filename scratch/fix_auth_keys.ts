import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up JWKS and resetting admin password...");
    
    // Clear JWKS so Better Auth regenerates them with the new secret
    const deletedJwks = await prisma.jwks.deleteMany({});
    console.log(`Deleted ${deletedJwks.count} JWKS records.`);

    // Note: Better Auth uses the secret as a pepper. 
    // We need to re-hash the password or let the user sign up again.
    // Since we can't easily hash it exactly like Better Auth without the internal logic,
    // let's try to just clear the JWKS first and see if login works with the old password.
    // If it still says "Invalid password", we'll have to reset it.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
