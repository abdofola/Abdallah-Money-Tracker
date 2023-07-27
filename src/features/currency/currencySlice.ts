import { createSlice } from "@reduxjs/toolkit";
import { en } from "@locales";
import type { PayloadAction, Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export type CurrencyState = {
  id: string;
  short: keyof typeof en.currency.codes | "";
  long: string;
};

const initialState: CurrencyState = {
  id: "",
  short: "",
  long: "",
};

const slice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<CurrencyState >) => {
      state.id = action.payload.id;
      state.short = action.payload.short;
      state.long = action.payload.long;
    },
  },
});

export const { setCurrency } = slice.actions;
export const selectCurrentCurrency = (state: RootState) => state.currency;
export default slice.reducer;

// middleware
export const currencyLocalStorageMiddleware: Middleware =
  (_store) =>
  (next) =>
  (action) => {
    if (setCurrency.match(action)) {
      window.localStorage.setItem(
        "currency",
        JSON.stringify((action.payload))
      );
    }

    return next(action);
  };
