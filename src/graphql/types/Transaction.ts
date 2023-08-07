import { builder } from "../builder";

//Schema structure
builder.prismaObject("Transaction", {
  fields: (t) => ({
    id: t.exposeID("id"),
    amount: t.expose("amount", { type: "Decimal" }),
    category: t.relation("category"),
    currency: t.relation("currency"),
    date: t.expose("date", { type: "Date" }),
    comment: t.expose("comment", { type: "String", nullable: true }),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("createdAt", { type: "Date" }),
  }),
});

//SCHEMA BEHAIVIOR

// get all transactions
builder.queryField("transactions", (t) =>
  t.prismaField({
    type: ["Transaction"],
    args: {
      userId: t.arg.string({ required: true }),
      currencyId: t.arg.string({ required: true }),
      categoryId: t.arg.string(),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      const { userId, categoryId, currencyId } = args;

      return await ctx.prisma.transaction.findMany({
        ...query,
        orderBy: {
          date: "desc",
        },
        // if there's a query param of `categoryId`
        where: {
          user: { is: { id: userId } },
          currency: { is: { id: currencyId } },
          category: { is: !categoryId ? {} : { id: categoryId } },
        },
      });
    },
  })
);

//get single transaction
builder.queryField("transaction", (t) =>
  t.prismaField({
    type: "Transaction",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      return await ctx.prisma.transaction.findUniqueOrThrow({
        ...query,
        where: args,
      });
    },
  })
);

// add new transaction
builder.mutationField("addTransaction", (t) =>
  t.prismaField({
    type: "Transaction",
    args: {
      amount: t.arg({ type: "Decimal", required: true }),
      date: t.arg.string({ required: true }),
      categoryId: t.arg.string({ required: true }),
      userId: t.arg.string({ required: true }),
      currencyId: t.arg.string({ required: true }),
      comment: t.arg.string(),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      if (!ctx.session.user) {
        throw new Error(`you need to signin to create your transaction!`);
      }

      try {
        return await ctx.prisma.transaction.create({
          data: args,
          ...query,
        });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    },
  })
);

// update transaction
builder.mutationField("updateTransaction", (t) =>
  t.prismaField({
    type: "Transaction",
    args: {
      id: t.arg.string({ required: true }),
      amount: t.arg({ type: "Decimal", required: true }),
      date: t.arg.string({ required: true }),
      categoryId: t.arg.string({ required: true }),
      currencyId: t.arg.string({ required: true }),
      comment: t.arg.string(),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      const { id, ...data } = args;
      return await ctx.prisma.transaction.update({
        ...query,
        where: { id },
        data,
      });
    },
  })
);

//delete transaction
builder.mutationField("deleteTransaction", (t) =>
  t.prismaField({
    type: "Transaction",
    args: { id: t.arg.string({ required: true }) },
    resolve: async (query, _root, args, ctx, _info) => {
      return await ctx.prisma.transaction.delete({
        ...query,
        where: args,
      });
    },
  })
);
