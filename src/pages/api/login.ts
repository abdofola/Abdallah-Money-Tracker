import { withSessionRoute } from "@lib/session";
import prisma from "@lib/prisma";

export default withSessionRoute(async (req, res) => {
  const { email } = req.body;
  //400 -> bad request
  if (!email) return res.status(400).send({ message: `email is required!` });
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    req.session.user = user;
    await req.session.save();
    return res.status(200).json({ data: user });
  } catch (e) {
    //401 -> unauthorized
    return res.status(401).json({ message: (e as Error).message });
  }
});
