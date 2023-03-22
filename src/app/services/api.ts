import { createApi } from "@reduxjs/toolkit/query/react";
import { Category, TransactionElement } from "@features/transaction/types";
import { gql } from "graphql-request";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { Transaction, User as UserPrisma } from "@prisma/client";
import { enviroment } from "@lib/enviroment";

interface User extends UserPrisma {
  transactions: TransactionElement[];
  categories: Category[];
}
type UserResponse = { addUser: UserPrisma };
type NestedUserResponse = { user: User };

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlRequestBaseQuery({
    url: enviroment[process.env.NODE_ENV] + "/api/graphql",
  }),
  tagTypes: ["transactions", "transaction"],
  endpoints: (builder) => ({
    getTransactions: builder.query<
      { transactions: TransactionElement[] },
      { userId: string; category?: string }
    >({
      query: ({ userId, category }) => ({
        document: gql`
          query GetTransactions($userId: String!, $category: String) {
            transactions(userId: $userId, category: $category) {
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
        variables: { userId, category },
      }),
      providesTags: ["transactions"],
    }),
    getTransaction: builder.query<{ transaction: Transaction }, { id: string }>(
      {
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
      }
    ),
    addTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: ({ amount, date, categoryId, comment, userId }) => ({
        document: gql`
          mutation AddTransaction(
            $amount: Int!
            $date: String!
            $userId: String!
            $categoryId: String!
            $comment: String
          ) {
            addTransaction(
              amount: $amount
              date: $date
              userId: $userId
              categoryId: $categoryId
              comment: $comment
            ) {
              amount
              date
              category {
                id
              }
            }
          }
        `,
        variables: { amount, date, categoryId, userId, comment },
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
            $comment: String
          ) {
            updateTransaction(
              id: $id
              amount: $amount
              date: $date
              categoryId: $categoryId
              comment: $comment
            ) {
              amount
              date
              comment
              category {
                name
                type
              }
            }
          }
        `,
        variables: transaction,
      }),
      invalidatesTags: ["transactions", "transaction"],
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
    getUser: builder.query<NestedUserResponse, { email: string }>({
      query: ({ email }) => ({
        document: gql`
          query GetUser($email: String!) {
            user(email: $email) {
              id
              email
              role
              transactions {
                id
                amount
                category {
                  color
                  iconId
                  id
                  name
                  type
                }
                date
                comment
              }
              categories {
                color
                iconId
                id
                name
                type
              }
            }
          }
        `,
        variables: { email },
      }),
    }),
    addUser: builder.mutation<UserResponse, { email: string }>({
      query: ({ email }) => ({
        document: gql`
          mutation Adduser($email: String!) {
            addUser(email: $email) {
              id
              email
              role
            }
          }
        `,
        variables: { email },
      }),
    }),
  }),
});

export const {
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
  useAddTransactionMutation,
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useGetUserQuery,
  useAddUserMutation,
} = api;
