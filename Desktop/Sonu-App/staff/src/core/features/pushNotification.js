import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PUSH_NOTIFICATION_TOKEN } from "../../actions/actionTypes";
import { postPushTokenToBackend } from "../../actions/featuresActions";
import moment from "moment";

// function to get the phone excess token

async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;

  return token;
}

// calling the function to get token

export default function PushNotificationHandler({ children }) {
  const dispatch = useDispatch();
  const { appointment } = useSelector((state) => state.AppointmentReducer);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
    }),
  });

  useEffect(() => {
    // registerForPushNotificationsAsync().then((token) => {
    //   dispatch({ type: PUSH_NOTIFICATION_TOKEN, payload: { token: token } })
    // })
  }, []);

  useEffect(() => {
    const sd = appointment?.data?.filter(
      (ele) => ele.date == new Date().toISOString().split("T")[0]
    );

    sd?.forEach((ele) => {
      const differenceOfTime = moment(ele.start_time, "h:mm a").diff(
        new Date()
      );

      const title =
        ele?.client?.name +
        "  appointment for " +
        ele?.service?.[0].name +
        " will be on " +
        ele?.start_time;
      {
        differenceOfTime > 0 &&
          setTimeout(() => {
            registerForPushNotificationsAsync().then((token) => {
              sendPushNotifiation(
                token,
                "appointemnt in next " +
                  Math.floor(differenceOfTime / 60 / 1000) +
                  " min",
                title
              );
            });
          }, differenceOfTime - 10 * 60 * 1000);
      }
    });
  }, []);

  return <>{children}</>;
}

// function to send push notification to the user phone

export const sendPushNotifiation = async (token, title, body) => {
  const message = {
    to: token,
    sound: "default",
    title: title,
    body: body,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
