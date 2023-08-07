import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let userData: Prisma.UserCreateInput = {
  email: "someone@admin.com",
  role: "ADMIN",
};

async function main() {
  const user = await prisma.user.create({
    data: userData,
  });

  console.log(`user with email ${user.email} has been created!`)
}

//un-comment this to feed your DB
// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
