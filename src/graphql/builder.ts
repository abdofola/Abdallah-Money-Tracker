import SchemaBuilder from "@pothos/core";
import { DateResolver, JSONResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import prisma from "@lib/prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { PrismaClient } from "@prisma/client";

type Translation = { ar: string; en: string };
type TSchemaBuilder = {
  Scalars: {
    Date: { Input: Date; Output: Date };
    Json: { Input: Translation; Output: Translation };
  };
  Context: {
    prisma: PrismaClient;
  };
  PrismaTypes: PrismaTypes;
};

export const builder = new SchemaBuilder<TSchemaBuilder>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

builder.addScalarType("Date", DateResolver, {});
builder.addScalarType("Json", JSONResolver, {});
builder.queryType({});
builder.mutationType({});
