import { Prisma, PrismaClient } from "@prisma/client";

export const categories: Prisma.CategoryCreateWithoutUserInput[] = [
  {
    name: { en: "groceries", ar: "خضروات" },
    color: "lavender",
    iconId: "groceries",
    type: "expenses",
  },
  {
    name: { en: "education", ar: "تعليم" },
    color: "blueviolet",
    iconId: "education",
    type: "expenses",
  },
  {
    name: { en: "health", ar: "صحة" },
    color: "orchid",
    iconId: "health",
    type: "expenses",
  },
  {
    name: { en: "electricity", ar: "كهرباء" },
    color: "gold",
    iconId: "electricity",
    type: "expenses",
  },
  {
    name: { en: "snacks", ar: "وجبات" },
    color: "teal",
    iconId: "snacks",
    type: "expenses",
  },
  {
    name: { en: "transportation", ar: "مواصلات" },
    color: "tan",
    iconId: "transportation",
    type: "expenses",
  },
  {
    name: { en: "fuel", ar: "بنزين" },
    color: "magenta",
    iconId: "fuel",
    type: "expenses",
  },
  {
    name: { en: "salary", ar: "مرتب" },
    color: "blue",
    iconId: "salary",
    type: "income",
  },
  {
    name: { en: "transfer", ar: "حوالة" },
    color: "skyblue",
    iconId: "transfer",
    type: "income",
  },
  {
    name: { en: "gift", ar: "هدية" },
    color: "orange",
    iconId: "gift",
    type: "income",
  },
];
const prisma = new PrismaClient();
let userData: Prisma.UserCreateInput = {
  email: "fola@admin.com",
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
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
