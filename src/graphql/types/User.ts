import { builder } from "../builder";

const Role = builder.enumType("Role", {
  values: ["USER", "ADMIN"] as const,
});

// SCHEMA
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

        try {
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
      } catch (err) {
        throw new Error("No user found");
      }
    },
  })
);

// signup user
builder.mutationField("signup", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: true }),
      name: t.arg.string(),
      role: t.arg({ type: Role }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!args.email) {
        throw new Error("you forgot your email!");
      }
      try {
        const userAlreadyExist = await ctx.prisma.user.findUnique({
          where: { email: args.email },
        });

        if (userAlreadyExist != null) {
          throw new Error("user already exists!");
        }

        const user = await ctx.prisma.user.create({
          data: { ...args, role: args.role ? args.role : "USER" },
          ...query,
        });

        return user;
      } catch (err) {
        throw err;
      }
    },
  })
);

// logout user
builder.mutationField("logout", (t) =>
  t.field({
    type: "Boolean",
    resolve: (_root, _args, ctx, _info) => {
      if (!ctx.session.user) {
        return false;
      }
      ctx.session.destroy();
      return true;
    },
  })
);

// super admin login
builder.mutationField("admin", (t) =>
  t.prismaField({
    type: "User",
    args: { email: t.arg.string({ required: true }) },
    resolve: async (_query, _root, args, ctx) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: args,
      });

      // check if it's super user admin
      if (user.email !== "fola@admin.com" && user.role !== "ADMIN") {
        throw new Error(
          "who are you, this page will be destroyed after 3 sec...!"
        );
      }

      ctx.session.user = user;
      await ctx.session.save();

      return user;
    },
  })
);
