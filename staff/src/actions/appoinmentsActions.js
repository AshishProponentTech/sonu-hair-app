import axios from "axios";
import {
  APPOINTMENT_REQUEST,
  APPOINTMENT_REQUEST_SUCCESS,
  APPOINTMENT_REQUEST_FAIL,
  ADD_APPOINTMENT_REQUEST,
  ADD_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_FAIL,
  APPOINTMENT_count_FAIL,
  APPOINTMENT_count_REQUEST,
  APPOINTMENT_count_SUCCESS,
  HOME_Page_APPOINTMENT,
} from "./actionTypes";
import { baseURL } from "../constants";
import { setBadgeCountAsync } from "expo-notifications";

export const loadAppointment = (data) => ({
  type: HOME_Page_APPOINTMENT,
  payload: data,
});

export const getAppointment = (userToken, date) => async (dispatch) => {
  try {
    dispatch({ type: APPOINTMENT_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    let url;
    if (date) {
      url = `${baseURL}/staff/appointment?date=${date}`;
    } else url = `${baseURL}/staff/appointment`;
    const { data } = await axios.get(url, config);
    dispatch({ type: APPOINTMENT_REQUEST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: APPOINTMENT_REQUEST_FAIL, payload: error.response.data });
  }
};

export const addAppointment =
  (appointmentData, userToken) => async (dispatch) => {
    try {
      dispatch({ type: ADD_APPOINTMENT_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };

      const { data } = await axios.post(
        `${baseURL}/staff/appointment`,
        appointmentData,
        config
      );

      dispatch({ type: ADD_APPOINTMENT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ADD_APPOINTMENT_FAIL, payload: error.response.data });
    }
  };

export const getAppointmentCount = (userToken) => async (dispatch) => {
  try {
    dispatch({ type: APPOINTMENT_count_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    const { data } = await axios.get(
      `${baseURL}/staff/appointment_count`,
      config
    );
    dispatch({ type: APPOINTMENT_count_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: APPOINTMENT_count_FAIL, payload: error.response.data });
  }
};
