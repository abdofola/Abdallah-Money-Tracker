import { fetchJson } from "@lib/utils";
import { User } from "@prisma/client";
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

builder.mutationField("addUser", (t) =>
  t.prismaField({
    type: "User",
    args: { email: t.arg.string({ required: true }) },
    // @ts-ignore
    resolve: async (_query, _root, args, _ctx, _info) => {
      /**
       * this resolver represents a wrapper around
       * the endpoint /api/signup
       * TODO:
       * session cookies does not get safed when making the request from the resolver?
       */
      try {
        const user = await fetchJson<User>("http://localhost:3000/api/signup", {
          method: "POST",
          body: args,
          referrer: "http://localhost:3000/api/graphql",
        });

        return user;
      } catch (error) {
        throw error;
      }
    },
  })
);
