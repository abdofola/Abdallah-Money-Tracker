import { api } from "./api";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import type { Category } from "@features/transaction/types";
import type { RootState } from "../store";

const categoriesAdapter = createEntityAdapter<Category>();
const initialState = categoriesAdapter.getInitialState();
const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<typeof initialState, void>({
      query: () => "/categories",
      transformResponse: (responseData: Category[]) => {
        return categoriesAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});
const selectCategoriesResult = extendedApi.endpoints.getCategories.select();
const selectCategoriesData = createSelector(
  selectCategoriesResult,
  (categoriesResult) => categoriesResult.data
);

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
} = categoriesAdapter.getSelectors<RootState>(
  (state) => selectCategoriesData(state) ?? initialState
);

export const { useGetCategoriesQuery } = extendedApi;
