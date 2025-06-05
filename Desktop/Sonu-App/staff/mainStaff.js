import React, { useEffect, useState } from "react";
import store from "./src/store";
import { Provider } from "react-redux";
import RootStack from "./src/components/RootStack";
import { Provider as PaperProvider } from "react-native-paper";
import KeyboardDetection from "./src/core/features/keyboardDetection";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "./assets/splash.png";
import { Image, Platform, SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clearLogEntriesAsync } from "expo-updates";
// import PushNotificationHandler from "./src/core/features/pushNotification"

export default function Staff() {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* <Provider store={store}>
        <PaperProvider> */}
      <KeyboardDetection>
        {/* <PushNotificationHandler> */}
        {/* {Platform.OS && <View style={{ paddingTop: insets.top }}></View>} */}
        <RootStack />
        {/* </PushNotificationHandler> */}
      </KeyboardDetection>
      {/* </PaperProvider>
      </Provider> */}
    </>
  );
}
