
import { AuthState } from "./store";
import { createFeatureSelector, createSelector } from "@ngrx/store";


export const selectAuthState =createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn
);