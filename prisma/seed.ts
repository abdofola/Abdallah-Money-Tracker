import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let userData: Prisma.UserCreateInput = {
  email: "someone@example.com",
  role: "USER",
};

async function main() {
  const user = await prisma.user.create({
    data: userData,
  });

  console.log(`user with email ${user.email} has been created!`)
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
