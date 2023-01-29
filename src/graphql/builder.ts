import SchemaBuilder from "@pothos/core";
import { DateResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import prisma from "@lib/prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { PrismaClient, Role, Type } from "@prisma/client";

class User {
  id: string;
  email: string;
  role: Role;
  constructor(id: string, email: string, role: Role) {
    this.id = id;
    this.email = email;
    this.role = role;
  }
}
type TSchemaBuilder = {
  Scalars: {
    Date: { Input: Date; Output: Date };
    Type: { Input: Type; Output: Type };
  };
  Context: {
    prisma: PrismaClient
    user?: User;
    token?: string;
  };
  PrismaTypes: PrismaTypes;
};

export const builder = new SchemaBuilder<TSchemaBuilder>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

builder.addScalarType("Date", DateResolver, {});
builder.queryType({});
builder.mutationType({})
