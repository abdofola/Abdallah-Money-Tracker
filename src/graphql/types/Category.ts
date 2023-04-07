import { builder } from "../builder";

const Type = builder.enumType("Type", {
  values: ["income", "expenses"] as const,
});

builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeID("id"),
    type: t.expose("type", { type: Type }),
    name: t.expose("name", { type: "Json" }),
    color: t.exposeString("color"),
    iconId: t.exposeString("iconId"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("createdAt", { type: "Date" }),
  }),
});

builder.queryField("categories", (t) =>
  t.prismaField({
    type: ["Category"],
    args: { userId: t.arg.string({ required: true }) },
    resolve: async (query, _root, args, ctx, _info) => {
      return await ctx.prisma.category.findMany({
        ...query,
        where: args,
      });
    },
  })
);

builder.mutationField("addCategory", (t) => {
  return t.prismaField({
    type: "Category",
    args: {
      userId: t.arg.string({ required: true }),
      name: t.arg({ type: "Json", required: true }),
      type: t.arg({ type: Type, required: true }),
      iconId: t.arg.string({ required: true }),
      color: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      return await ctx.prisma.category.create({
        data: args,
        ...query,
      });
    },
  });
});
