import { View, Text, Button } from "react-native";
import React, { useRef } from "react";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { sendPushNotifiation } from "../../core/features/pushNotification";
import { useState } from "react";

export default function Index() {
  const { pushNotificationToken } = useSelector((state) => state.feature);
  const [token, setToken] = useState();

  const sendNotifications = async (prop) => {
    sendPushNotifiation(prop);
  };

  return (
    <View>
      <Text>{pushNotificationToken}</Text>
      <Button
        title="to the same phone"
        onPress={() => {
          sendNotifications(pushNotificationToken);
        }}
      ></Button>
      <TextInput
        value={token}
        onChangeText={(value) => setToken(value)}
      ></TextInput>
      <Button
        title="to the entered phone"
        onPress={() => {
          sendNotifications(token);
        }}
      ></Button>
    </View>
  );
}
