import axios from "axios";
import configResponse from "../config/constant";
import * as SecureStore from "expo-secure-store";

async function DeleteAccount(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.post(`${configResponse.baseURL}/auth/delete`, data, {
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

export default DeleteAccount;
