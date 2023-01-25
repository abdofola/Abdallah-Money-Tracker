import { User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { api } from "@app/services/api";

type AuthState = {
  user: User | null;
};

const slice = createSlice({
  name: "auth",
  initialState: { user: null } as AuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // in case the client refresh, set the `user` state to the currently logged-in.
    // this is why you have a flash of 'login' when refresh. 
    builder.addMatcher(
      api.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
      }
    );
  },
});

export const { setCredentials } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;

export default slice.reducer;
