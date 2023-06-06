import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import { authReducer } from "@features/auth";
import {
  currencyLocalStorageMiddleware,
  currencyReducer,
} from "@features/currency";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    currency: currencyReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      api.middleware,
      currencyLocalStorageMiddleware
    );
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
