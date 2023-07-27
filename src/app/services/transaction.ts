import { api } from "./api";
import { gql } from "graphql-request";
import { Transaction } from "@prisma/client";
import { TransactionElement } from "@features/transaction/types";

const extendedApi = api.injectEndpoints({
  endpoints(builder) {
    return {
      getTransactions: builder.query<
        { transactions: TransactionElement[] },
        { userId: string; currencyId: string; categoryId?: string }
      >({
        query: (args) => ({
          document: gql`
            query GetTransactions(
              $userId: String!
              $currencyId: String!
              $categoryId: String
            ) {
              transactions(
                userId: $userId
                currencyId: $currencyId
                categoryId: $categoryId
              ) {
                id
                amount
                date
                comment
                category {
                  id
                  name
                  type
                  color
                  iconId
                }
              }
            }
          `,
          variables: args,
        }),
        providesTags: ["transactions"],
      }),
      getTransaction: builder.query<
        { transaction: Transaction },
        { id: string }
      >({
        query: ({ id }) => {
          return {
            document: gql`
              query GetTransaction($id: String!) {
                transaction(id: $id) {
                  amount
                  date
                  comment
                  category {
                    id
                    type
                    name
                    color
                    iconId
                  }
                }
              }
            `,
            variables: { id },
          };
        },
        providesTags: ["transactions"],
      }),
      addTransaction: builder.mutation<Transaction, Partial<Transaction>>({
        query: (args) => ({
          document: gql`
            mutation AddTransaction(
              $amount: Int!
              $date: String!
              $userId: String!
              $categoryId: String!
              $currencyId: String!
              $comment: String
            ) {
              addTransaction(
                amount: $amount
                date: $date
                userId: $userId
                categoryId: $categoryId
                currencyId: $currencyId
                comment: $comment
              ) {
                amount
                date
                currency {
                  id
                  name
                }
                category {
                  id
                }
              }
            }
          `,
          variables: args,
        }),
        invalidatesTags: ["transactions"],
      }),
      updateTransaction: builder.mutation<Transaction, Partial<Transaction>>({
        query: (transaction) => ({
          document: gql`
            mutation UpdateTransaction(
              $id: String!
              $amount: Int!
              $date: String!
              $categoryId: String!
              $currencyId: String!
              $comment: String
            ) {
              updateTransaction(
                id: $id
                amount: $amount
                date: $date
                categoryId: $categoryId
                currencyId: $currencyId
                comment: $comment
              ) {
                amount
                date
                comment
                currency {
                  id
                  name
                }
                category {
                  name
                  type
                }
              }
            }
          `,
          variables: transaction,
        }),
        invalidatesTags: ["transactions"],
      }),
      deleteTransaction: builder.mutation<Transaction, { id: string }>({
        query: ({ id }) => ({
          document: gql`
            mutation DeleteTransaction($id: String!) {
              deleteTransaction(id: $id) {
                id
              }
            }
          `,
          variables: { id },
        }),
        invalidatesTags: ["transactions"],
      }),
    };
  },
});

export const {
  useGetTransactionQuery,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} = extendedApi;
