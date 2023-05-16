import { withSessionRoute } from "@lib/session";
import prisma from "@lib/prisma";

export default withSessionRoute(async (req, res) => {
  const { email, isAdmin } = req.body;
  //400 -> bad request
  if (!email) return res.status(400).send({ message: `email is required!` });

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
    });

    // the request to login as an admin
    if (isAdmin && !(user.role === "ADMIN")) {
      // -> 403 forbidden; due to permissions
      return res.status(403).json({
        message: "you need to be an admin to add new user!",
        success: false,
      });
    }
    const data = user;
    req.session.user = data;

    // don't save cookie; when the request to login as an admin is to add new user.
    !isAdmin && (await req.session.save());

    return res.status(200).json({ data });
  } catch (e) {
    //401 -> unauthorized
    return res.status(401).json({ message: (e as Error).message });
  }
});
