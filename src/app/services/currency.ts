import { Currency } from "@prisma/client";
import { api } from "./api";
import { gql } from "graphql-request";

type Response = {
  query: {
    currencies: { currencies: Currency[] };
    currency: { currency: Currency };
  };
  mutation: {
    add: { addCurrency: Currency };
    delete: Currency;
  };
};

type Params = {
  query: {
    currencies: { userId: string };
    currency: { [k in "id" | "userId"]: string };
  };
  mutation: {
    add: { name: string; userId: string };
    delete: any;
  };
};

const extendedApi = api.injectEndpoints({
  endpoints(builder) {
    return {
      getCurrencies: builder.query<
        Response["query"]["currencies"],
        Params["query"]["currencies"]
      >({
        query(args) {
          return {
            document: gql`
              query ($userId: String!) {
                currencies(userId: $userId) {
                  id
                  name
                }
              }
            `,
            variables: args,
          };
        },
        providesTags: ["currency"],
      }),
      getCurrency: builder.query<
        Response["query"]["currency"],
        Params["query"]["currency"]
      >({
        query(args) {
          return {
            document: gql`
              query ($id: String!, $userId: String!) {
                currency(id: $id, userId: $userId) {
                  id
                  name
                }
              }
            `,
            variables: args,
          };
        },
        providesTags: ["currency"],
      }),
      addCurrency: builder.mutation<
        Response["mutation"]["add"],
        Params["mutation"]["add"]
      >({
        query(args) {
          return {
            document: gql`
              mutation ($userId: String!, $name: String!) {
                addCurrency(userId: $userId, name: $name) {
                  id
                  name
                }
              }
            `,
            variables: args,
          };
        },
        invalidatesTags: ["currency"],
      }),
    };
  },
});

export const {
  useGetCurrenciesQuery,
  useGetCurrencyQuery,
  useAddCurrencyMutation,
} = extendedApi;
