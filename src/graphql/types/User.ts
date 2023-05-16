import { builder } from "../builder";

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

// GET USER
builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      return ctx.prisma.user.findUniqueOrThrow({
        ...query,
        where: { email: args.email },
      });
    },
  })
);

