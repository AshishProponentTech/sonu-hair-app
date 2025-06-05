import axios from "axios";
import configResponse from "../config/constant";
import * as SecureStore from "expo-secure-store";

async function AllLocation() {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.get(`${configResponse.baseURL}/auth/location`, {
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

export { AllLocation };
