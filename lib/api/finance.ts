import prisma from "@lib/prisma";
import { Finance } from "@prisma/client";

type Range = { gte: Date | string; lte?: Date | string };
type Data = Omit<{ [key in keyof Finance]?: Finance[key] }, "id">;

type Update = (id: string, data: Data) => Promise<Finance>;

export const allRecords = async () => await prisma.finance.findMany();

export const getSingleRecord = async (id: string) =>
  await prisma.finance.findUniqueOrThrow({
    where: { id },
  });

export const createRecord = async (finance: any) =>
  await prisma.finance.create({
    data: finance,
  
  });

export const updateSingleRecord: Update = async (id, dataToUpdate) =>
  await prisma.finance.update({
    where: { id },
    data: { ...dataToUpdate },
  });

export const deleteSingleRecord = async (id: string) =>
  await prisma.finance.delete({
    where: { id },
  });

export async function getRecordsByDate({ lte, gte }: Range) {
  return await prisma.finance.findMany({
    where: {
      updatedAt: {
        gte,
        lte: lte ?? undefined,
      },
    },
  });
}
