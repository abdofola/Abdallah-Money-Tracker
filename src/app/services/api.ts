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
  tagTypes: ["transactions"],
  endpoints: (builder) => ({
    getTransactions: builder.query<{transactions:Transaction[]}, {userId:string}>({
      query: ({userId})=>({
        document:gql`
          query GetTransactions($userId:String!){
            transactions(userId:$userId){
              id,
              amount,
              date,
              comment,
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
        variables:{userId}
      }),
      providesTags: ["transactions"],
    }),
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
              amount: $amount,
              date: $date,
              userId: $userId,
              categoryId: $categoryId,
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
  useAddTransactionMutation,
  useGetTransactionsQuery,
  useGetUserQuery,
  useAddUserMutation,
} = api;
