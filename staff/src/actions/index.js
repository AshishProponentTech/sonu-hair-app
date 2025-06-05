import {
  TOGGLE_THEME,
  IS_LOGGED_IN,
  IS_VALID_USER,
  GET_TOKEN,
  SAVE_TOKEN,
  REMOVE_TOKEN,
  LOADING,
  ERROR,
  SHOW_APP_INTRO,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  SET_USER,
} from "./actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseURL } from "../constants";
import { postPushTokenToBackend } from "./featuresActions";
import { ToastAndroid } from "react-native";
import Toast from "react-native-root-toast";

export const toggleTheme = (theme) => ({
  type: TOGGLE_THEME,
  payload: theme,
});

export const manageLoggingStatus = (status) => ({
  type: IS_LOGGED_IN,
  payload: status,
});

export const isValidUser = (flag) => ({
  type: IS_VALID_USER,
  payload: flag,
});

export const isAppIntroStatus = (status) => ({
  type: SHOW_APP_INTRO,
  payload: status,
});

export const getToken = (token) => ({
  type: GET_TOKEN,
  token,
});

export const saveToken = (token) => ({
  type: SAVE_TOKEN,
  token,
});

export const removeToken = () => ({
  type: REMOVE_TOKEN,
});

export const loading = (bool) => ({
  type: LOADING,
  isLoading: bool,
});

export const error = (error) => ({
  type: ERROR,
  error,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

//Async Actions

export const getUserToken = () => (dispatch) => {
  AsyncStorage.getItem("userToken")
    .then((data) => {
      dispatch(loading(false));
      dispatch(getToken(data));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || "ERROR"));
    });
};

export const saveUserToken = (token) => (dispatch) => {
  if (typeof token != "string") token = null;
  AsyncStorage.setItem("userToken", token)
    .then((data) => {
      dispatch(saveToken(token));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || "ERROR"));
    });
};

export const removeUserToken = (userToken) => async (dispatch) => {
  try {
    // comment : sonu => need to add this api for logout

    // const { data } = await axios.post(`${baseURL}/staff/logout`, {
    //     headers:  {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Authorization': `Bearer ${userToken}`
    //     }
    // });

    AsyncStorage.removeItem("userToken")
      .then((data) => {
        dispatch(loading(true));
        dispatch(removeToken());
        manageLoggingStatus(false);
      })
      .catch((err) => {
        dispatch(loading(false));
        dispatch(error(err.message || "ERROR"));
      });
  } catch (error) {
    // ToastAndroid.show('Logout failed', ToastAndroid.SHORT);
    Toast.show("Logout failed", {
      duration: Toast.durations.LONG,
    });
  }
};

// Login  User
export const userLogin =
  ({ email, password, pushNotificationToken }) =>
  async (dispatch) => {
    const userData = { email: email, password: password };

    try {
      dispatch({ type: USER_LOGIN_REQUEST });
      const { data } = await axios.post(`${baseURL}/staff/login`, userData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      dispatch({ type: USER_LOGIN_SUCCESS, payload: data.data });
      dispatch(postPushTokenToBackend(data.data.token, pushNotificationToken));
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: { error: error.response.data, user: userData },
      });
    }
  };

// Load User
export const LoadUser = (userToken) => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    const { data } = await axios.get(`${baseURL}/staff/me`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    dispatch({ type: LOAD_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error });
  }
};
