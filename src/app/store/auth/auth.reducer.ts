import {createReducer, on} from "@ngrx/store";
import {login, logout} from "./auth.actions";

export const initialLogin = {
  isAuth: false,
  isAdmin: false,
  user: undefined
}

export const authReducer = createReducer(
  initialLogin,
  on(login, (state, {login }) => (
    {
      isAuth: true,
      isAdmin: login.isAdmin,
      user: state.user
    }
  )),
  on(logout, (state) => (
    {
      ... initialLogin
    }
  ))
)
