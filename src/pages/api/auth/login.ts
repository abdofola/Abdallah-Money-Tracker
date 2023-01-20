import { sessionOptions } from "@lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";
import { categories } from "prisma/seed";

export default withIronSessionApiRoute(loginRout, sessionOptions);

async function loginRout(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  try {
    if (email) {
      req.session.user = { email };
      await prisma.user.create({
        data: { email, categories: { create: categories } },
      });
      return res.status(200).json({
        message: `User with email: ${email} has been created successfully!`,
      });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
}
