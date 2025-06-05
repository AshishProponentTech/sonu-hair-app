import React from "react";
import axios from "axios";
import { baseURL } from "../constants";
import moment from "moment";

const UserLogin = async (userData) => {
  try {
    const { data } = await axios.post(`${baseURL}/staff/login`, userData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return data;
  } catch (error) {
    return error;
  }
};
const getAPP = async (userToken) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    const date = moment(new Date()).format("Y-MM-DD");
    let url = `${baseURL}/staff/appointment?date=${date}`;
    const { data } = await axios.get(url, config);
    return data;
  } catch (error) {
    return error;
  }
};

export { UserLogin, getAPP };
