import { builder } from "../builder";
import prisma from "@lib/prisma";

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
      id: t.arg.string(),
    },
    resolve: async (query, _root, args, ctx, info) => {
      //TODO: replace findMany with findUnique
      return prisma.user.findUniqueOrThrow({
        ...query,
        where: { id: args.id! },
      });
    },
  })
);
