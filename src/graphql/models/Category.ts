import { builder } from "../builder";

builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeID("id"),
    type: t.exposeString("type"),
    name: t.exposeString("name"),
    color: t.exposeString("color"),
    iconId: t.exposeString("iconId"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("createdAt", { type: "Date" }),

}),
});
