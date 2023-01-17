import { createYoga } from "graphql-yoga";
import { schema } from "src/graphql/schema";
import type { NextApiRequest, NextApiResponse } from "next";

type TCreateYoga = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

export default createYoga<TCreateYoga>({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: "/api/graphql",
});
