import axios from "axios";
import configResponse from "../config/constant";
import * as SecureStore from "expo-secure-store";

async function OtpVerificationRequest(data, token) {
  try {
    // const token = SecureStore.isAvailableAsync("token")
    //   ? await SecureStore.getItemAsync("token")
    //   : null;
    return await axios.get(`${configResponse.baseURL}/auth/otp?${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error.response;
  }
}

async function ResendOtpRequest(tokens) {
  try {
    const token = SecureStore.isAvailableAsync("token")
      ? await SecureStore.getItemAsync("token")
      : null;

    return await axios.get(`${configResponse.baseURL}/auth/resend`, {
      headers: {
        Authorization: `Bearer ${token ? token : tokens}`,
      },
    });
  } catch (error) {
    return error.response;
  }
}

export { OtpVerificationRequest, ResendOtpRequest };
