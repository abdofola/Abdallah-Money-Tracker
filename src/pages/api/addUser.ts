import prisma from "@lib/prisma";
import { withSessionRoute } from "@lib/session";

export default withSessionRoute(async function signupRoute(req, res) {
  const { email } = req.body;
  try {
    //400 -> bad request
    if (!email) return res.status(400).send({ message: `email is required!` });

    const user = await prisma.user.create({
      data: { email },
    });

    req.session.user = user;
    await req.session.save();

    return res.status(200).json(user);
  } catch (e) {
    const response = { message: (e as Error).message };

    if (e.code === "P2002") {
      // user already exist
      response.message = "user already exist!";
    }
    // some sort of prisma error
    return res.status(500).json(response);
  }
});
