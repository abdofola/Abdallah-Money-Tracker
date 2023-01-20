import { builder } from "../builder";
import { categories } from "prisma/seed";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    role: t.exposeString("role"),
    name: t.expose("name", { type: "String", nullable: true }),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("createdAt", { type: "Date" }),
    categories: t.relation("categories"),
    transactions: t.relation("transactions"),
  }),
});

builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      return ctx.prisma.user.findUniqueOrThrow({
        ...query,
        where: { id: args.email },
      });
    },
  })
);

builder.mutationField("addUser", (t) =>
  t.prismaField({
    type: "User",
    args: { email: t.arg.string({ required: true }) },
    resolve: async (query, _root, args, ctx, _info) => {
      if (ctx.user && ctx.user.email) {
        throw new Error(`email '${ctx.user.email}' already exists!`);
      }
      
      return ctx.prisma.user.create({
        ...query,
        data: {
          email: args.email,
          categories: {
            create: categories,
          },
        },
      });
    },
  })
);
