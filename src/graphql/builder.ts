import SchemaBuilder from "@pothos/core";
import { DateResolver, JSONResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import prisma from "@lib/prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { Context } from "./context";
import { Decimal } from "@prisma/client/runtime";

type Translation = { ar: string; en: string };
type TSchemaBuilder = {
  Scalars: {
    Date: { Input: Date; Output: Date };
    Json: { Input: Translation; Output: Translation };
    Decimal: { Input: Decimal; Output: Decimal };
  };
  Context: Context;
  PrismaTypes: PrismaTypes;
};

export const builder = new SchemaBuilder<TSchemaBuilder>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

// new scalar definition
builder.scalarType("Decimal", {
  serialize: (value) => value.toString(),
  parseValue: (value) => {
    if (typeof value !== "string") {
      throw new TypeError("Decimal must be a string");
    }

    return new Decimal(value);
  },
});
builder.addScalarType("Date", DateResolver, {});
builder.addScalarType("Json", JSONResolver, {});
builder.queryType({});
builder.mutationType({});
