import axios from "axios";
import { baseURL } from "../constants";
import { PUSH_NOTIFICATION_TOKEN } from "./actionTypes";

export const postPushTokenToBackend =
  (userToken, pushNotificationToken) => async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };
    } catch (error) {}
  };
// sonu.d@proponenttechnologies.com
// Sonutheo
