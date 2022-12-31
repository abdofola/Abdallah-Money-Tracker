import { wrapApiCall } from "../../../lib/helpers/handlerWrapper";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const handleGet = () => {
    //TODO: READ SINGLE RECORD.
  };
  const handlePost = () => {
    //TODO: add new finance record.
  };
  const handleUpdate = () => {
    //TODO: update single finance record.
  };
  const handleRequest: { [key: string]: any } = {
    GET: handleGet,
    POST: handlePost,
    PATCH: handleUpdate,
  };
  return req.method && handleRequest[req.method]();
}

export default wrapApiCall(handler);
