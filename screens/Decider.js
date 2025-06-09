import { useEffect } from "react";
import PropTypes from "prop-types";
import { AnimatedSplash } from "../components/AnimatedSplash"; 
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Decider({ navigation }) {
  console.log(navigation);
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
Decider.propTypes = {
  navigation: PropTypes.object.isRequired,
};