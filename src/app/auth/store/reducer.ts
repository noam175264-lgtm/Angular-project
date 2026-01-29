import { createReducer, on } from '@ngrx/store';
import { LOGIN, LOGOUT } from "./action";
import { initialState } from './store';

export const authReducer = createReducer(
  initialState,
  on(LOGIN, (state) => ({...state, isLoggedIn: true })),
  on(LOGOUT, (state) => ({...state, isLoggedIn: false }))
);