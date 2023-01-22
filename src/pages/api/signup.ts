import prisma from "@lib/prisma";
import { withSessionRoute } from "@lib/session";
import { categories } from "prisma/seed";
import { Prisma } from "@prisma/client";

export default withSessionRoute(async function signupRoute(req, res) {
  const { email } = req.body;
  console.log("-----restApi------->", { email });
  try {
    if (email) {
      const user = await prisma.user.create({
        data: { email, categories: { create: categories } },
        // include:{categories:true, transactions:true}
      });
      req.session.user = { ...user };
      // save the session
      // await req.session.save();
      console.log({session:req.session})
      return res.status(200).json(user);
    } else {
      return res.status(305).json({ message: `field 'email' is required!` });
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
      }
    }
    throw e
    // return res.status(500).json({message:e.message});
  }
});
