import axios from "axios";
import configResponse from "../config/constant";
import * as SecureStore from "expo-secure-store";

async function ShowProfile() {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.get(`${configResponse.baseURL}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error.response;
  }
}

async function UpdateProfile(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.post(
      `${configResponse.baseURL}/auth/updateProfile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  } catch (error) {
    return error?.response;
  }
}

async function UpdateProfileData(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.post(`${configResponse.baseURL}/auth/update`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error.response;
  }
}

export { ShowProfile, UpdateProfile, UpdateProfileData };
