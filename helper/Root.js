import React, { useEffect, useReducer, useMemo } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { loginOtpVerificationRequest, loginUpRequest, userLogout } from "../service/User";
import { AuthContext } from "./AuthContext";
import configResponse from "../config/constant";
import StackMenu from "../screens/StackMenu";
import DrawerMenu from "../screens/DrawerMenu";
import { AppStateContext } from "./AppStateContaxt";
import { useNavigation } from "@react-navigation/native";
import Spinner from "./Spinner";

export default function Root() {
  const navigation = useNavigation();
  const [locationModal, setLocationModal] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const [appointmentCount, setAppointmentCount] = React.useState(0);
  const [guestMode, setGuestMode] = React.useState(false);
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.error(e);
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };
    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data, token) => {
        loginOtpVerificationRequest(data, token)
          .then(async (response) => {
            if (response?.status == 200 || response?.status == 201) {
              await SecureStore.setItemAsync("userToken", response?.data?.data?.token);
              console.log(`${response?.data?.data?.first_name} ${response?.data?.data?.last_name}`);
              const firstName = response?.data?.data?.first_name || "";
              const lastName = response?.data?.data?.last_name || "";
              const fullName = (firstName + " " + lastName).trim() || "no first or last name";
              await SecureStore.setItemAsync("userName", fullName);
              await SecureStore.setItemAsync("userEmail", response?.data?.data?.email || "no email");
              await SecureStore.setItemAsync("userPic", response?.data?.data?.profile || "no profile");
              await SecureStore.setItemAsync("userPhone", response?.data?.data?.phone || "no number");
              await SecureStore.setItemAsync("userType", "client");
              dispatch({ type: "SIGN_IN", token: response?.data?.data?.token });
            } else if (response?.status == 401) {
              navigation.navigate("AccountVerify", { useremail: email });
            } else if (response?.status == 400 || response?.status == 500) {
              configResponse.errorMSG(response.data.errors);
            } else {
              const resultError = response?.data?.errors?.validate;
              let errorlist = "";
              for (const [value] of Object.entries(resultError)) {
                errorlist += `${value}\n`;
              }
              configResponse.errorMSG(errorlist);
            }
          })
          .catch((error) => {
            configResponse.errorMSG(error.message);
          });
      },
      signInByEmail: (data) => {
        loginUpRequest(data)
          .then(async (response) => {
            const { status, data: resData } = response;
            if (status === 200 || status === 201) {
              configResponse.successMSG(resData.message);

              const userData = resData.data || {};
              const firstName = userData.first_name || "";
              const lastName = userData.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim() || "no first or last name";

              try {
                await SecureStore.setItemAsync("userToken", userData.token || "");
                await SecureStore.setItemAsync("userName", fullName);
                await SecureStore.setItemAsync("userEmail", userData.email || "no email");
                await SecureStore.setItemAsync("userPic", userData.profile || "no profile");
                await SecureStore.setItemAsync("userPhone", userData.phone || "no number");
                await SecureStore.setItemAsync("userType", "client");

                dispatch({ type: "SIGN_IN", token: userData.token });
              } catch (err) {
                console.error("Error saving data:", err);
              }

            } else if (status === 401) {
              navigation.navigate("AccountVerify", { useremail: data.email });

            } else if (status === 400 || status === 500) {
              console.warn("Server returned 400 or 500. Please try again.");

            } else if (resData?.errors?.validate) {
              const resultError = resData.errors.validate;
              const errorList = Object.values(resultError).join("\n");
              console.warn(errorList);
            }

            const validate = resData?.errors?.validate;
            if (validate) {
              if (validate.email) configResponse.errorMSG(validate.email[0]);
              else if (validate.phone) configResponse.errorMSG(validate.phone[0]);
              else if (validate.credentials) configResponse.errorMSG(validate.credentials);
              else if (validate.verified) configResponse.errorMSG(validate.verified);
            }

            if (resData?.errors === "Email not verified") {
              navigation.navigate("LoginOtpVerification", { token: resData?.token });
            }
          })
          .catch((error) => {
            configResponse.errorMSG(error?.data?.message || "Something went wrong.");
          });
      },
      signOut: () => {
        userLogout();
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );
  const contextValue = useMemo(() => ({ ...authContext, state }), [authContext, state]);
    const data = useMemo(() => ({
    locationModal,
    setLocationModal,
    guestMode,
    setGuestMode,
    location,
    setLocation,
    appointmentCount,
    setAppointmentCount,
  }), [locationModal, guestMode, location, appointmentCount]);
  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={contextValue}>
      <AppStateContext.Provider value={data}>
        {state.userToken == null ? <StackMenu /> : <DrawerMenu />}
      </AppStateContext.Provider>
    </AuthContext.Provider>
  );
}
