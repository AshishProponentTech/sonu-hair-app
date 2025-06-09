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
  const [location, setLocations] = React.useState("");
  const [appointmentCount, setAppointmentCount] = React.useState(0);
  const [guestMode, setGuestMode] = React.useState(false);
  const data = {
    locationModal,
    setLocationModal,
    setGuestMode,
    guestMode,
    location,
    setLocations,
    setAppointmentCount,
    appointmentCount,
  };
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
              await SecureStore.setItemAsync(
                "userName",
                `${response?.data?.data?.first_name} ${response?.data?.data?.last_name}` || "no first or last name"
              );
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
              for (const [key, value] of Object.entries(resultError)) {
                errorlist += `${value}\n`;
              }
              configResponse.errorMSG(errorlist);
            }
          })
          .catch((error) => {
            configResponse.errorMSG(error.message);
          });
      },
      signInByEmail: async (data) => {
        loginUpRequest(data)
          .then(async (response) => {
            if (response?.status == 200) {
              configResponse.successMSG(response.data.message);

              if (response?.status == 200 || response?.status == 201) {
                try {
                  await SecureStore.setItemAsync("userToken", response?.data?.data?.token);
                  await SecureStore.setItemAsync(
                    "userName",
                    `${response?.data?.data?.first_name} ${response?.data?.data?.last_name}` || "no first or last name"
                  );
                  await SecureStore.setItemAsync("userEmail", response?.data?.data?.email || "no email");
                  await SecureStore.setItemAsync("userPic", response?.data?.data?.profile || "no profile");
                  await SecureStore.setItemAsync("userPhone", response?.data?.data?.phone || "no number");
                  await SecureStore.setItemAsync("userType", "client");
                  dispatch({ type: "SIGN_IN", token: response?.data?.data?.token });
                } catch (error) {
                  console.error("Error saving data:", error);
                }
              } else if (response?.status == 401) {
                navigation.navigate("AccountVerify", { useremail: email });
              } else if (response?.status == 400 || response?.status == 500) {
              } else {
                const resultError = response?.data?.errors?.validate;
                let errorlist = "";
                for (const [key, value] of Object.entries(resultError)) {
                  errorlist += `${value}\n`;
                }
              }
            } else {
              if (response.data.errors) {
                if (response.data.errors.validate.email) {
                  configResponse.errorMSG(response.data.errors.validate.email[0]);
                } else if (response.data.errors.validate.phone) {
                  configResponse.errorMSG(response.data.errors.validate.phone[0]);
                } else if (response.data.errors.validate.credentials) {
                  configResponse.errorMSG(response.data.errors.validate.credentials);
                } else if (response.data.errors.validate.verified) {
                  configResponse.errorMSG(response.data.errors.validate.verified);
                }
              }
              if (response.data.errors == "Email not verified") {
                navigation.navigate("LoginOtpVerification", { token: response?.data?.token });
              }
            }
          })
          .catch((error) => {
            configResponse.errorMSG(error.data.message);
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

  if (state.isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Spinner/>
      </View>
    );
  }
  return (
    <AuthContext.Provider value={{ ...authContext, state }}>
      <AppStateContext.Provider value={data}>
        {state.userToken == null ? <StackMenu /> : <DrawerMenu />}
      </AppStateContext.Provider>
    </AuthContext.Provider>
  );
}
