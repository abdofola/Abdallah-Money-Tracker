import prisma from "@lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "@lib/session";

export type Context = {
  prisma: PrismaClient;
  user?: { email: string };
};

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<Context> {
  const session = await getIronSession(req, res, sessionOptions);
  console.log("session in context:", session);
  // if the user is not logged in, omit returning the user
  if (!session) return { prisma };

  const { user } = session;

  return { prisma, user };
}
