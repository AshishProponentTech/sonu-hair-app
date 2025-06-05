import Client from "./mainClient";
import Staff from "./staff/mainStaff";
import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  SafeAreaView,
  Animated,
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "./assets/splash-new.jpg";
import logo from "./assets/logo2.png";
import { useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { clearLogEntriesAsync } from "expo-updates";
import ChangePassword from "./screens/ChangePassword";
import NewPassword from "./screens/NewPassword";
import OtpVerification from "./screens/OtpVerification";
import ForgotPassword from "./screens/ForgotPassword";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import store from "./staff/src/store";
import Login from "./screens/Login";

function AnimatedSplash() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const overlayFadeAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;
  const developerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial overlay fade in
    Animated.timing(overlayFadeAnim, {
      toValue: 0.6,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Sequence of animations
    Animated.sequence([
      // Logo zoom and fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Title fade in
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      // Subtitle fade in
      Animated.timing(subtitleFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 100,
        useNativeDriver: true,
      }),
      // Developer text fade in
      Animated.timing(developerFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Image source={splash} style={styles.backgroundImage} resizeMode="cover" />
      <Animated.View style={[styles.overlay, { opacity: overlayFadeAnim }]} />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.titleText, { opacity: titleFadeAnim }]}>
            SONU HAIR CUT
          </Animated.Text>
          <Animated.Text style={[styles.subtitleText, { opacity: subtitleFadeAnim }]}>
            HAIR SALON
          </Animated.Text>
          <Animated.Text style={[styles.developerText, { opacity: developerFadeAnim }]}>
            Developed by proponent technologies
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    primary_font: require("./assets/fonts/WorkSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AnimatedSplash />;
  }

  const Stack = createStackNavigator();
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <RootSiblingParent>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="screenDecider" component={Decider} />
                <Stack.Screen name="clientMain" component={Client} />
                <Stack.Screen name="StaffMain" component={Staff} />
              </Stack.Navigator>
            </RootSiblingParent>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

function Decider({ navigation }) {
  const authCheckHandler = async () => {
    const clientToken = await SecureStore.getItemAsync("userToken");
    const staffToken = await AsyncStorage.getItem("userToken");
    !clientToken && staffToken
      ? navigation.reset({
          index: 0,
          routes: [{ name: "StaffMain" }],
        })
      : navigation.reset({
          index: 0,
          routes: [{ name: "clientMain" }],
        });
  };

  useEffect(() => {
    setTimeout(() => {
      authCheckHandler();
    }, 5000); // Increased timeout to show animation
  }, []);

  return <AnimatedSplash />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  backgroundImage: {
    width: wp("100%"),
    height: hp("100%"),
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: wp("60%"),
    height: wp("60%"),
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  titleText: {
    fontSize: wp("7%"),
    fontFamily: "Inter_700Bold",
    color: "#D1AE6C", // Golden color
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 2,
  },
  subtitleText: {
    fontSize: wp("5.5%"),
    fontFamily: "Inter_400Regular",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1.5,
  },
  developerText: {
    fontSize: wp("3%"),
    fontFamily: "Inter_400Regular",
    color: "white",
    opacity: 0.8,
    textAlign: "center",
  },
});