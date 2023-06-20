import { builder } from "../builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    role: t.exposeString("role"),
    name: t.expose("name", { type: "String", nullable: true }),
    last_login: t.expose("last_login", { type: "Date", nullable: true }),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("createdAt", { type: "Date" }),
    categories: t.relation("categories"),
    transactions: t.relation("transactions"),
  }),
});

// QUERY
// get single user
builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (_query, _root, args, ctx, _info) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: args,
      });

      return user;
    },
  })
);

// MUTATION
// add new user
builder.mutationField("addUser", (t) =>
  t.prismaField({
    type: "User",
    args: { email: t.arg.string({ required: true }) },
    // @ts-ignore
    resolve: async (_query, _root, args, _ctx, _info) => {
      //TODO: adding new user is permitted for super user admin,
      // and super **_ONLY_**.
      try {
      } catch (error) {
        throw error;
      }
    },
  })
);

// updating user
builder.mutationField("updateUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.string({ required: true }),
      last_login: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx, _info) => {
      try {
        const user = await ctx.prisma.user.update({
          data: { last_login: args.last_login },
          where: { id: args.id },
          ...query,
        });

        return user;
      } catch (error) {
        throw error;
      }
    },
  })
);

//login user
builder.mutationField("login", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: true }),
      last_login: t.arg.string({ required: true }),
    },
    resolve: async (_query, _root, args, ctx, _info) => {
      try {
        const user = await ctx.prisma.user.findUniqueOrThrow({
          where: { email: args.email },
        });

        //check whether the user has logged in before or not
        // if not don't update the `last_login` field
        if (!user.last_login) {
          ctx.session.user = user;
          await ctx.session.save();

          return user;
        }

        const updatedUser = await ctx.prisma.user.update({
          where: { email: user.email },
          data: { last_login: args.last_login },
        });

        ctx.session.user = updatedUser;
        await ctx.session.save();

        return updatedUser;
      } catch (err) {
        throw err;
      }
    },
  })
);

// logout user
// TODO
