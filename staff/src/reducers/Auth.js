import { AUTH_STATUS } from "../constants";
import {
  SAVE_TOKEN,
  REMOVE_TOKEN,
  LOADING,
  ERROR,
  GET_TOKEN,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  SET_USER,
} from "../actions/actionTypes";

const initialState = {
  token: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  user: {},
};

export default Auth = (state = initialState, action) => {
  switch (action.type) {
    case GET_TOKEN:
      return { ...state, token: action.token };

    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOAD_USER_REQUEST:
      return {
        ...state,
        error: null,
      };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case LOAD_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };

    case LOAD_USER_FAIL:
    case USER_LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        error: action.payload,
        loading: false,
      };

    case SAVE_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case REMOVE_TOKEN:
      return {
        ...state,
        token: {},
        isAuthenticated: false,
      };
    case LOADING:
      return { ...state, loading: action.isLoading };
    case ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
