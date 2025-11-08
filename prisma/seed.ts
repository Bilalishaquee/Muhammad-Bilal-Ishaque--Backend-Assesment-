import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create mock users with quotas
  const users = ['user1', 'user2', 'user3'];

  for (const userId of users) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    await prisma.userQuota.upsert({
      where: {
        userId: userId,
      },
      update: {},
      create: {
        userId,
        month,
        year,
        usedCount: 0,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

