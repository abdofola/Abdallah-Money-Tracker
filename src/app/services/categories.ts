import { api } from "./api";
import { gql } from "graphql-request";
import { Category } from "@prisma/client";

type Response = {
  [k in "income" | "expenses"]: Category[];
};
const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Response, { userId: string }>({
      query: (args) => ({
        document: gql`
          query ($userId: String!) {
            categories(userId: $userId) {
              id
              name
              type
              iconId
              color
            }
          }
        `,
        variables: args,
      }),
      providesTags: ["categories"],
      transformResponse(
        baseQueryReturnValue: { categories: Category[] },
        _meta,
        _arg
      ) {
        const categories = { income: [], expenses: [] } as Response;
        for (let cat of baseQueryReturnValue.categories) {
          categories[cat.type].push(cat);
        }

        return categories;
      },
    }),
    addCategory: builder.mutation<
      { addCategory: Category },
      Partial<Category> & { userId: string }
    >({
      query: (args) => ({
        document: gql`
          mutation (
            $userId: String!
            $type: Type!
            $color: String!
            $iconId: String!
            $name: Json!
          ) {
            addCategory(
              userId: $userId
              type: $type
              color: $color
              iconId: $iconId
              name: $name
            ) {
              id
            }
          }
        `,
        variables: args,
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const { useGetCategoriesQuery, useAddCategoryMutation } = extendedApi;
