import SchemaBuilder from "@pothos/core";
import { DateResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import prisma from "@lib/prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { Type } from "@prisma/client";

type TSchemaBuilder = {
  Scalars: {
    Date: { Input: Date; Output: Date };
    Type: { Input: Type; Output: Type };
  };
  PrismaTypes: PrismaTypes;
};

export const builder = new SchemaBuilder<TSchemaBuilder>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

builder.addScalarType("Date", DateResolver, {});
builder.queryType({});
