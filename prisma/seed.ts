import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let userData: Prisma.UserCreateInput = {
  name: "Abdallah",
  finances: {
    create: [
      {
        name: "rent",
        type: "EXPENSE",
      },
      {
        name: 'grossary',
        type: 'EXPENSE'
      },
      {
        name: 'electricity',
        type: 'EXPENSE'
      }
    ],
  },
};

async function main() {
  const user = await prisma.user.create({
    data: userData,
  });
  console.log(`Created user with id: ${user.id}`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
