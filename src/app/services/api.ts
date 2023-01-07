import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TransactionElement } from "@features/transaction/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API }),
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionElement[], void>({
      query: () => "/transactions",
    }),
    addTransaction: builder.mutation<
      TransactionElement,
      Partial<TransactionElement>
    >({
      query: (body) => ({ url: "/transactions", method: "POST", body }),
    }),
  }),
});

// console.log((api.endpoints.getCategories.select())(''))

export const { useAddTransactionMutation, useGetTransactionsQuery } = api;
