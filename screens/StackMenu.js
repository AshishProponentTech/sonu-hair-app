import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Login";
import SignUp from "../screens/SignUp";
import ForgotPassword from "../screens/ForgotPassword";
import OtpVerification from "../screens/OtpVerification";
import NewPassword from "../screens/NewPassword";
import AccountVerification from "../screens/AccountVerification";
import LoginOtpVerification from "../screens/LoginOtpVerification";
import DrawerMenu from "./DrawerMenu";
const Stack = createNativeStackNavigator();

function StackMenu() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginOtpVerification"
        component={LoginOtpVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPasswordCreate"
        component={NewPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountVerify"
        component={AccountVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DrawerMenu"
        component={DrawerMenu}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}

export default StackMenu;
