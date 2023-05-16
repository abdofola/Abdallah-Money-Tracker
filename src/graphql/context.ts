import prisma from "@lib/prisma";
import { sessionOptions } from "@lib/session";
import { PrismaClient } from "@prisma/client";
import { IronSession, getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

export type Context = {
  prisma: PrismaClient;
  user: IronSession["user"];
};

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<Context> {
  const session = await getIronSession(req, res, sessionOptions);

  // console.log({ session });
  return { prisma, user: session.user };
}
