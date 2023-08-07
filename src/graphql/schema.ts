import { builder } from "./builder";
import { Decimal } from "@prisma/client/runtime";
import "./types/User";
import "./types/Category";
import "./types/Transaction";
import "./types/Currency";

builder.scalarType("Decimal", {
  serialize: (value) => value.toString(),
  parseValue: (value) => {
    if (typeof value !== "string") {
      throw new TypeError("Decimal must be a string");
    }

    return new Decimal(value);
  },
});
export const schema = builder.toSchema({});
