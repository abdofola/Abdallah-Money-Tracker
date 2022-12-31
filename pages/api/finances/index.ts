import type { NextApiRequest, NextApiResponse } from "next";
import { wrapApiCall } from "@lib/helpers";
import { allRecords, getRecordsByDate, updateSingleRecord } from "@api";

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
function dateBeforeDays(days: number) {
  const today = new Date();
  return new Date(new Date().setDate(today.getDate() - days));
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const handleGet: Handler = async (req, res) => {
    const { range } = req.query;
    const today = new Date();
    const begin = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const before7Days = dateBeforeDays(7);
    const before30Days = dateBeforeDays(30);
    // Thunks
    const recordsOfToday = async () =>
      await getRecordsByDate({
        gte: begin,
      });
    const recordsOfLast7Days = async () =>
      await getRecordsByDate({ gte: before7Days, lte: today });
    const recordsOfLast30Days = async () =>
      await getRecordsByDate({ gte: before30Days, lte: today });
    const mapRecordBydate = new Map([
      ["today", recordsOfToday],
      ["last7days", recordsOfLast7Days],
      ["last30days", recordsOfLast30Days],
    ]);

    if (!range) res.status(200).json(await allRecords());
    else res.status(200).json(await mapRecordBydate.get(range as string)());
  };

  const handlePatch: Handler = async (req, res) => {
    const { id, amount, color } = req.body;
    //TODO: validate req.body
    const updateFinance = await updateSingleRecord(id, {
      amount: Number(amount),
      color,
    });

    res.status(200).json({ data: updateFinance });
  };

  const handlePost: Handler = async (req, res) => {
    const { type, amount, date, color, userId } = req.body;
    //TODO: 
    // 1- validate req.body
    // 2- create finance record in db.
    // 3- send response.
  };

  const requestMapper = new Map<string, Handler>([
    ["GET", handleGet],
    ["PATCH", handlePatch],
    ["POST", handlePost],
  ]);

  res.setHeader("Allow", ["GET", "PATCH", "POST"]);
  requestMapper.get(req.method!)(req, res);
}

export default wrapApiCall(handler);
