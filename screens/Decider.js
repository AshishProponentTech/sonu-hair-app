// screens/Decider.js
import React, { useEffect } from "react";
import { AnimatedSplash } from "../components/AnimatedSplash"; // You'll separate this too
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Decider({ navigation }) {
  const authCheckHandler = async () => {
    const clientToken = await SecureStore.getItemAsync("userToken");
    const staffToken = await AsyncStorage.getItem("userToken");

    !clientToken && staffToken
      ? navigation.reset({ index: 0, routes: [{ name: "StaffMain" }] })
      : navigation.reset({ index: 0, routes: [{ name: "clientMain" }] });
  };

  useEffect(() => {
    setTimeout(authCheckHandler, 5000);
  }, []);

  return <AnimatedSplash />;
}
