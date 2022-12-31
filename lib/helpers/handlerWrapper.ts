import type { NextApiRequest, NextApiResponse } from "next";

type ApiCall = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const wrapApiCall: (fn: ApiCall) => ApiCall =
  (fn) => async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      const allowedMethods = res.getHeader("allow");
      const isMehtodAllowed =
        allowedMethods instanceof Array && allowedMethods.includes(req.method!);

      if (!isMehtodAllowed)
        res.status(405).send(`Method "${req.method}" Not Allowed`);
      else res.status(500).send(err);
    }
  };

