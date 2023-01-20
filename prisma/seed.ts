import { Prisma, PrismaClient } from "@prisma/client";

export const categories: Prisma.CategoryCreateWithoutUserInput[] = [
  {
    name: "groceries",
    color: "lavender",
    iconId: "groceries",
    type: "expenses",
  },
  {
    name: "education",
    color: "blueviolet",
    iconId: "education",
    type: "expenses",
  },
  {
    name: "health",
    color: "orchid",
    iconId: "health",
    type: "expenses",
  },
  {
    name: "electricity",
    color: "gold",
    iconId: "electricity",
    type: "expenses",
  },
  {
    name: "snacks",
    color: "teal",
    iconId: "snacks",
    type: "expenses",
  },
  {
    name: "transportation",
    color: "tan",
    iconId: "transportation",
    type: "expenses",
  },
  {
    name: "fuel",
    color: "magenta",
    iconId: "fuel",
    type: "expenses",
  },
  {
    name: "salary",
    color: "blue",
    iconId: "salary",
    type: "income",
  },
  {
    name: "transfer",
    color: "skyblue",
    iconId: "transfer",
    type: "income",
  },
  {
    name: "gift",
    color: "orange",
    iconId: "gift",
    type: "income",
  },
];
const prisma = new PrismaClient();
let userData: Prisma.UserCreateInput = {
  email: "fola@a.com",
  role: "ADMIN",
  categories: {
    create: categories,
  },
};

async function main() {
  const user = await prisma.user.create({
    data: userData,
    include: {
      categories: true,
    },
  });
  console.log(`Created user with email: ${user.email}`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
