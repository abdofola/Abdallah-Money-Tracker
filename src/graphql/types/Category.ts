import { builder } from "../builder";

builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeID("id"),
    type: t.exposeString("type"),
    //TODO: wrong types of `name`, it should be of type `JSON`
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
