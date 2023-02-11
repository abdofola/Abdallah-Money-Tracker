import { withSessionRoute } from "@lib/session";
import prisma from "@lib/prisma";

export default withSessionRoute(async (req, res) => {
  const { email } = req.body;
  const categories = { income: [], expenses: [] };
  //400 -> bad request
  if (!email) return res.status(400).send({ message: `email is required!` });

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: { categories: true },
    });

    for (let c of user.categories) {
      categories[c.type].push(c);
    }

    const data = { ...user, categories };
    req.session.user = data;
    
    await req.session.save();

    return res.status(200).json({ data });
  } catch (e) {
    //401 -> unauthorized
    return res.status(401).json({ message: (e as Error).message });
  }
});
