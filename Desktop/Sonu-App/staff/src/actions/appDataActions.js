import axios from "axios";
import {
  GET_SERVICES_FAIL,
  GET_SERVICES_REQUEST,
  GET_SERVICES_SUCCESS,
  GET_SLOT_FAIL,
  GET_SLOT_REQUEST,
  GET_SLOT_SUCCESS,
  GET_CLIENTS_FAIL,
  GET_CLIENTS_REQUEST,
  GET_CLIENTS_SUCCESS,
  GET_STAFF_REQUEST,
  GET_STAFF_SUCCESS,
  GET_STAFF_FAIL,
  GET_UNAVAILABLETY_FAIL,
  GET_UNAVAILABLETY_REQUEST,
  GET_UNAVAILABLETY_SUCCESS,
  DELETE_UNAVAILABLETY_SUCCESS,
  DELETE_UNAVAILABLETY_REQUEST,
  DELETE_UNAVAILABLETY_FAIL,
} from "./actionTypes";

import { baseURL } from "../constants";
import { ToastAndroid } from "react-native";
import Toast from "react-native-root-toast";
import moment from "moment";

export const getSlots =
  (userToken, date, duration, Id, setFetching = false) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_SLOT_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };
      let url;

      if (Id) {
        url = `${baseURL}/staff/appointment/available?date=${date}&duration=${duration}&staff_id=${Id}`;
      } else
        url = `${baseURL}/staff/appointment/available?date=${date}&duration=${duration}`;

      const { data } = await axios.get(url, config);
      setFetching && setFetching((data) => ({ ...data, slot: true }));
      dispatch({ type: GET_SLOT_SUCCESS, payload: data });
    } catch (error) {
      setFetching && setFetching((data) => ({ ...data, slot: false }));
      dispatch({ type: GET_SLOT_FAIL, payload: error.response.data });
    }
  };

export const getServices =
  (userToken, staffId, setFetching = false) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_SERVICES_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };
      const { data } = await axios.get(
        `${baseURL}/staff/appointment/service?staffId=${staffId}`,
        config
      );
      setFetching && setFetching((data) => ({ ...data, service: false }));

      dispatch({ type: GET_SERVICES_SUCCESS, payload: data.data });
    } catch (error) {
      setFetching && setFetching((data) => ({ ...data, service: false }));
      dispatch({ type: GET_SERVICES_FAIL, payload: error.response.data });
    }
  };

export const getClients = (userToken, phone) => async (dispatch) => {
  try {
    dispatch({ type: GET_CLIENTS_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/staff/client?id=&phone=${phone}`,
      config
    );

    dispatch({ type: GET_CLIENTS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: GET_CLIENTS_FAIL, payload: error.response.data });
  }
};

export const getStaffs = (userToken, date) => async (dispatch) => {
  try {
    const formatedDate = moment(date).format("YYYY-MM-DD");

    dispatch({ type: GET_STAFF_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/staff/appointment/staff?date=${formatedDate}`,
      config
    );
    dispatch({ type: GET_STAFF_SUCCESS, payload: data.staff });
  } catch (error) {
    dispatch({ type: GET_STAFF_FAIL, payload: error.response.data });
  }
};

export const getUnavailability = (userToken) => async (dispatch) => {
  try {
    dispatch({ type: GET_UNAVAILABLETY_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/staff/holiday`, config);
    dispatch({
      type: GET_UNAVAILABLETY_SUCCESS,
      payload: data?.data?.holidays,
    });
  } catch (error) {
    dispatch({ type: GET_UNAVAILABLETY_FAIL, payload: error.response.data });
  }
};
export const deleteUnavailability = (userToken, id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_UNAVAILABLETY_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    // comment : sonu => _id:1, not working
    const { data } = await axios.delete(
      `${baseURL}/staff/holiday?id=${id}`,
      config
    );

    dispatch({ type: DELETE_UNAVAILABLETY_SUCCESS });
    dispatch(getUnavailability(userToken));
    // ToastAndroid.show("Holiday Deleted SuccessFully", ToastAndroid.SHORT)
    Toast.show("Holiday Deleted SuccessFully", {
      duration: Toast.durations.LONG,
    });
  } catch (error) {
    // ToastAndroid.show(error.message, ToastAndroid.SHORT)
    Toast.show(error.message, {
      duration: Toast.durations.LONG,
    });

    dispatch({ type: DELETE_UNAVAILABLETY_FAIL, payload: error.response.data });
  }
};
