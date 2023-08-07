import { builder } from "./builder";
import { Decimal } from "@prisma/client/runtime";
import "./types/User";
import "./types/Category";
import "./types/Transaction";
import "./types/Currency";

export const schema = builder.toSchema({});
