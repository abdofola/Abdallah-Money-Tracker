import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "graphql-request";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { Role, User } from "@prisma/client";
import { enviroment } from "@lib/enviroment";

export type E = {
  [k in "name" | "message" | "originalError"]: string;
};

const url = enviroment[process.env.NODE_ENV] + "/api/graphql";

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlRequestBaseQuery<E>({
    url,
    customErrors: (args) => {
      const [error] = args.response.errors!;
      console.log({args})
      return {
        name: args.name,
        message: error.message,
        originalError: error.extensions?.originalError.message,
      };
    },
  }),
  tagTypes: ["transactions", "categories", "user", "currency"],
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
      providesTags: ["user"],
    }),
    signup: builder.mutation<
      { signup: User },
      { email: string; role?: Role; name?: string }
    >({
      query: (args) => ({
        document: gql`
          mutation ($email: String!, $name: String, $role: Role) {
            signup(email: $email, name: $name, role: $role) {
              name
              email
              role
            }
          }
        `,
        variables: args,
      }),
    }),
    updateUser: builder.mutation<
      { updateUser: User },
      { id: string; last_login: Date }
    >({
      query: (args) => ({
        document: gql`
          mutation ($id: String!, $last_login: String!) {
            updateUser(id: $id, last_login: $last_login) {
              last_login
            }
          }
        `,
        variables: args,
      }),
      invalidatesTags: ["user"],
    }),
    login: builder.mutation<
      { login: User },
      { email: string; last_login: Date }
    >({
      query: (args) => ({
        document: gql`
          mutation ($email: String!, $last_login: String!) {
            login(email: $email, last_login: $last_login) {
              id
              name
              email
              last_login
            }
          }
        `,
        variables: args,
      }),
      invalidatesTags: ["user"],
    }),
    logout: builder.mutation<void, undefined>({
      query: () => ({
        document: gql`
          mutation {
            logout
          }
        `,
      }),
    }),
    admin: builder.mutation<{ admin: User }, { email: string }>({
      query: (args) => ({
        document: gql`
          mutation ($email: String!) {
            admin(email: $email) {
              id
              last_login
              name
              role
            }
          }
        `,
        variables: args,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useAdminMutation,
} = api;
