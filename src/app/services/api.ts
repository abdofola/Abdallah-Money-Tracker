import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "graphql-request";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { User } from "@prisma/client";
import { enviroment } from "@lib/enviroment";

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlRequestBaseQuery({
    url: enviroment[process.env.NODE_ENV] + "/api/graphql",
  }),
  tagTypes: ["transactions", "categories"],
  endpoints: (builder) => ({
    getUser: builder.query<{ user: User }, { email: string }>({
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
    addUser: builder.mutation<{ addUser: User }, { email: string }>({
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

export const { useGetUserQuery, useAddUserMutation } = api;
