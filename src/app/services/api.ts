import { createApi } from "@reduxjs/toolkit/query/react";
import { Category, TransactionElement } from "@features/transaction/types";
import { gql } from "graphql-request";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { Transaction, User as UserPrisma } from "@prisma/client";

interface User extends UserPrisma {
  transactions: TransactionElement[];
  categories: Category[];
}
type UserResponse = { user: User };

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlRequestBaseQuery({
    url: "http://localhost:3000/api/graphql",
  }),
  endpoints: (builder) => ({
    addTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: ({ amount, date, categoryId, comment, userId }) => ({
        document: gql`
          mutation AddTransaction(
            $amount: Int!
            $date: String!
            $userId: String!
            $categoryId: String!
          ) {
            addTransaction(
              amount: $amount
              date: $date
              userId: $userId
              categoryId: $categoryId
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
    }),
    getUser: builder.query<UserResponse, { email: string }>({
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
              categories {
                id
                type
                name
                color
                iconId
              }
            }
          }
        `,
        variables: { email },
      }),
    }),
  }),
});

export const {
  useAddTransactionMutation,
  useGetUserQuery,
  useAddUserMutation,
} = api;
