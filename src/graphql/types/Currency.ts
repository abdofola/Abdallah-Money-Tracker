import { builder } from "../builder";

builder.prismaObject("Currency", {
  fields(t) {
    return {
      id: t.exposeID("id"),
      name: t.exposeString("name"),
      transactions: t.relation("transactions"),
      userId: t.exposeString("userId"),
    };
  },
});

// query all currencies
builder.queryField("currencies", (t) => {
  return t.prismaField({
    type: ["Currency"],
    args: { userId: t.arg.string({ required: true }) },
    async resolve(query, _root, args, ctx, _info) {
      const currencies = await ctx.prisma.currency.findMany({
        ...query,
        where: args,
      });
      console.log({ currencies });
      return currencies;
    },
  });
});

//query single currency
builder.queryField("currency", (t) => {
  return t.prismaField({
    type: "Currency",
    args: { id: t.arg.string({ required: true }) },
    async resolve(query, _root, args, ctx, _info) {
      return await ctx.prisma.currency.findUniqueOrThrow({
        ...query,
        where: args,
      });
    },
  });
});

// mutation: add new currency
builder.mutationField("addCurrency", (t) => {
  return t.prismaField({
    type: "Currency",
    args: {
      userId: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    async resolve(query, _root, args, ctx, _info) {
      const user = await ctx.prisma.user.findUnique({
        where: { id: args.userId },
      });
      const currencies = await ctx.prisma.currency.findMany({
        where: { id: args.userId },
      });

      // if the role is `USER`; they only authorized to create one currency account.
      if (currencies.length >= 1 && user?.role === "USER") {
        throw new Error("you don't have permissions to add more than account");
      }
      return await ctx.prisma.currency.create({ data: args, ...query });
    },
  });
});
