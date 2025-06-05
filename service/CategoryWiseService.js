import axios from "axios";
import * as SecureStore from "expo-secure-store";
import configResponse from "../config/constant";

async function getCategory() {
  try {
    const token = SecureStore.isAvailableAsync("userToken");
    const tokenData = (await SecureStore.getItemAsync("userToken"))
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.get(
      `${configResponse.baseURL}/auth/getCategory?type=service`
    );
  } catch (error) {
    return error.response;
  }
}

async function getService(data) {
  try {
    const token = SecureStore.isAvailableAsync("userToken")
      ? await SecureStore.getItemAsync("userToken")
      : null;
    return await axios.get(
      `${configResponse.baseURL}/auth/getServiceById?id=${data}`
    );
  } catch (error) {
    return error.response;
  }
}

export { getCategory, getService };
