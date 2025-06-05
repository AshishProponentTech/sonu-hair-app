import axios from "axios";
import configResponse from "../config/constant";
import * as SecureStore from "expo-secure-store";

async function BookApointment(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.post(
      `${configResponse.baseURL}/auth/bookAppointment`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    return error.response;
  }
}
async function BookRescheduleAppointment(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.post(
      `${configResponse.baseURL}/auth/updateAppointment`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    return error.response;
  }
}
async function MyBooking(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.post(
      `${configResponse.baseURL}/auth/myAppointment`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    return error.response;
  }
}

async function CancelApointment(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.post(
      `${configResponse.baseURL}/auth/cancelAppointment`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    return error.response;
  }
}

export {
  BookApointment,
  MyBooking,
  CancelApointment,
  BookRescheduleAppointment,
};
