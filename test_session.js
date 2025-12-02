const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if leader exists
  const leader = await prisma.user.findUnique({
    where: { email: 'leader@example.com' },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log('Leader in database:');
  console.log(leader);
  console.log('\nExpected user ID to be sent in Bearer token:', leader?.id);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
