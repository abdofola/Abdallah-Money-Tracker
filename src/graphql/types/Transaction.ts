import { builder } from "../builder";

//Type Transaction Schema structure
builder.prismaObject("Transaction", {
  fields: (t) => ({
    id: t.exposeID("id"),
    amount: t.exposeInt("amount"),
    category: t.relation("category"),
    date: t.expose("date", { type: "Date" }),
    comment: t.expose("comment", { type: "String", nullable: true }),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("createdAt", { type: "Date" }),
  }),
});

// get all transactions
builder.queryField("transactions", (t) =>
  t.prismaField({
    type: ["Transaction"],
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      return await ctx.prisma.transaction.findMany({
        ...query,
        orderBy: {
          date: "desc",
        },
        where: args,
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
      amount: t.arg.int({ required: true }),
      date: t.arg.string({ required: true }),
      categoryId: t.arg.string({ required: true }),
      userId: t.arg.string({ required: true }),
      comment: t.arg.string(),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      //Due to `iron-session` not working properly with `graphql`
      // no way to add the userSession to the context!
      // if (!ctx.user)
      //   throw new Error(`you need to signin to create your transaction!`);

      return await ctx.prisma.transaction.create({
        data: {
          amount: args.amount,
          date: args.date,
          userId: args.userId,
          categoryId: args.categoryId,
          comment: args.comment,
        },
        ...query,
      });
    },
  })
);

// update transaction
builder.mutationField("updateTransaction", (t) =>
  t.prismaField({
    type: "Transaction",
    args: {
      id: t.arg.string({ required: true }),
      amount: t.arg.int({ required: true }),
      date: t.arg.string({ required: true }),
      categoryId: t.arg.string({ required: true }),
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
