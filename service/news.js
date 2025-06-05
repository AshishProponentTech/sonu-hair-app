import axios from "axios";
import configResponse from "../config/constant";
import * as SecureStore from "expo-secure-store";

async function newsData() {
  try {
    const isTokenAvailable = await SecureStore.isAvailableAsync();
    const token = isTokenAvailable
      ? await SecureStore.getItemAsync("userToken")
      : null;

    const response = await axios.get(`${configResponse.baseURL}/auth/news`, {
    
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });
    // console.log("News API data:", response?.data);
    // console.log("Full response:", response);

    return response;
  } catch (error) {
    console.error("Error fetching news:", error);
    return error.response || { status: 500, data: { message: "Unknown error" } };
  }
}

export default newsData;
