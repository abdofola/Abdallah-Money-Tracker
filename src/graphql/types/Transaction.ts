import { builder } from "../builder";

builder.prismaObject("Transaction", {
  fields: (t) => ({
    id: t.exposeID("id"),
    amount: t.exposeInt("amount"),
    category: t.relation("category"),
    date: t.expose("date", { type: "Date" }),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("createdAt", { type: "Date" }),
  }),
});
