import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const transactionsAdpapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = transactionsAdpapter.getInitialState();

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
});
