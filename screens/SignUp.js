import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Pressable,
  TextInput,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";

import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { signUpRequest } from "../service/User";
import PhoneInput from "react-native-phone-number-input";
import Spinner from "react-native-loading-spinner-overlay";

import configResponse from "../config/constant";

import logo from "../assets/logo2.png";

import Background from "../assets/images/background/SplashBackground.png";

import { AppStateContext } from "../helper/AppStateContaxt";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash.png";
import { responsive } from "../helper/responsive";
import * as Yup from "yup";
import { err } from "react-native-svg";

function SignUp({ navigation }) {
  const { setGuestMode } = React.useContext(AppStateContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [first_name, onChangeFirstName] = React.useState(null);
  const [last_name, onChangeLastName] = React.useState(null);
  const [email, onChangeEmail] = React.useState(null);
  const [phone, onChangePhone] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  const phoneInput = React.useRef(null);
  const [formattedValue, setFormattedValue] = React.useState("");

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <>
        <View style={{ backgroundColor: "black" }}>
          <Image
            resizeMode="cover"
            style={{
              height: hp("100%"),
              backgroundColor: "black",
              display: "flex",
              alignSelf: "center",
            }}
            source={splash}
          />
        </View>
      </>
    );
  }
  // const SignUpRequest = () => {
  //   const country_code = formattedValue;
  //   const dial_code = phoneInput.current?.getCountryCode();

  //   // Check all conditions for validity
  //   if (!first_name) {
  //     return configResponse.errorMSG("Enter first name");
  //   }
  //   if (!last_name) {
  //     return configResponse.errorMSG("Enter last name");
  //   }
  //   if (!email) {
  //     return configResponse.errorMSG("Enter email id");
  //   }
  //   if (!password) {
  //     return configResponse.errorMSG("Enter Password");
  //   }
  //   if (!country_code) {
  //     return configResponse.errorMSG("Please enter your phone number");
  //   }

  //   Yup.object({
  //     first_name: Yup.string()
  //       .matches(/^[a-zA-Z]+$/, "First Name should only contain letters")
  //       .required("First Name is required"),
  //     last_name: Yup.string()
  //       .matches(/^[a-zA-Z]+$/, "Last Name should only contain letters")
  //       .required("Last Name is required"),
  //     email: Yup.string()
  //       .email("Invalid email")
  //       .matches(
  //         /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  //         "Invalid email address"
  //       )
  //       .required("Email is required"),
  //     password: Yup.string()
  //       .min(8, "Password must be at least 8 characters")
  //       .required("Password is required"),
  //   })
  //     .validate({
  //       first_name,
  //       last_name,
  //       email,
  //       password,
  //     })
  //     .then(() => {
  //       setIsLoading(true);
  //       const data = {
  //         first_name,
  //         last_name,
  //         email,
  //         phone,
  //         country_code,
  //         password,
  //         dial_code,
  //       };
  //       signUpRequest(data);
  //       console
  //         .log("value", data)
  //         .then(async (response) => {
  //           console.log("response", response.data);
  //           setIsLoading(false);
  //           if (response?.status == 200 || response?.status == 201) {
  //             onChangeFirstName(null);
  //             onChangeLastName(null);
  //             onChangeEmail(null);
  //             onChangePhone(null);
  //             setGuestMode(false);
  //             navigation.navigate("LoginOtpVerification", {
  //               token: response?.data?.data?.token,
  //             });
  //           } else if (response.data.errors) {
  //             if (response.data.errors.email) {
  //               configResponse.errorMSG(response.data.errors.email[0]);
  //             } else if (response.data.errors.phone) {
  //               configResponse.errorMSG(response.data.errors.phone[0]);
  //             } else if (
  //               response.data.errors.phone &&
  //               response.data.errors.email
  //             ) {
  //               configResponse.errorMSG(response.data.errors.phone[0]);
  //             }
  //           } else {
  //             const resultError = response?.data?.errors?.validate;
  //             let errorlist = "";
  //             for (const [key, value] of Object.entries(resultError)) {
  //               errorlist += `${value}\n`;
  //             }
  //             configResponse.errorMSG(errorlist);
  //           }
  //         })
  //         .catch((error) => {
  //           console.log("Data Error", error);
  //         });
  //     })
  //     .catch((error) => {
  //       configResponse.errorMSG(error.message);
  //     });
  // };
  const SignUpRequest = async () => {
    try {
      // Validate input fields
      if (!first_name) {
        return configResponse.errorMSG("Enter first name");
      }
      if (!last_name) {
        return configResponse.errorMSG("Enter last name");
      }
      if (!email) {
        return configResponse.errorMSG("Enter email id");
      }
      if (!password) {
        return configResponse.errorMSG("Enter Password");
      }
      if (!formattedValue) {
        return configResponse.errorMSG("Please enter your phone number");
      }

      // Validation with Yup schema
      await Yup.object({
        first_name: Yup.string()
          .matches(/^[a-zA-Z]+$/, "First Name should only contain letters")
          .required("First Name is required"),
        last_name: Yup.string()
          .matches(/^[a-zA-Z]+$/, "Last Name should only contain letters")
          .required("Last Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .matches(
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            "Invalid email address"
          )
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
      }).validate({
        first_name,
        last_name,
        email,
        password,
      });

      setIsLoading(true);

      const data = {
        first_name,
        last_name,
        email,
        phone,
        country_code: "+91",
        password,
        dial_code: phoneInput.current?.getCountryCode(),
      };

      // Call signUpRequest and wait for response
      const response = await signUpRequest(data);

      setIsLoading(false);

      if (response?.status === 200 || response?.status === 201) {
        onChangeFirstName(null);
        onChangeLastName(null);
        onChangeEmail(null);
        onChangePhone(null);
        setGuestMode(false);
        navigation.navigate("LoginOtpVerification", {
          token: response?.data?.data?.token,
        });
      } else if (response.data.errors) {
        if (response.data.errors.email) {
          configResponse.errorMSG(response.data.errors.email[0]);
        } else if (response.data.errors.phone) {
          configResponse.errorMSG(response.data.errors.phone[0]);
        } else if (response.data.errors.validate) {
          // Handle validation errors
          let errorlist = "";
          for (const [key, value] of Object.entries(
            response.data.errors.validate
          )) {
            errorlist += `${value}\n`;
          }
          configResponse.errorMSG(errorlist);
        }
      } else {
        configResponse.errorMSG("Failed to sign up. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error", error);
      configResponse.errorMSG(error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#272727" barStyle="dark-content" />
      <ImageBackground
        source={Background}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView contentContainerStyle={styles.scrollStyle}>
          <View style={styles.container_child}>
            <View style={styles.bottomLogoContainer}>
              <Image source={logo} style={styles.bottomLogo} />
            </View>
            <Spinner
              visible={isLoading}
              textContent={"Loading..."}
              textStyle={styles.spinnerTextStyle}
            />
            <Text style={styles.heading}>Sign Up </Text>

            <TextInput
              style={styles.input}
              placeholderTextColor="#808080"
              onChangeText={onChangeFirstName}
              value={first_name}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#808080"
              onChangeText={onChangeLastName}
              value={last_name}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#808080"
              onChangeText={onChangeEmail}
              value={email}
              textContentType="emailAddress"
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#808080"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
            />
            <PhoneInput
              ref={phoneInput}
              value={phone}
              defaultCode="CA"
              layout="first"
              onChangeText={(text) => {
                onChangePhone(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              containerStyle={styles.phoneContainerStyle}
              textInputStyle={styles.textInputStyle}
              codeTextStyle={styles.codeTextStyle}
            />
            <Pressable onPressIn={SignUpRequest} style={styles.SubmitButton}>
              <Text style={styles.SubmitButtonText}>Sign Up </Text>
            </Pressable>
            <Pressable
              style={styles.signIn}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.LinkButton}>Already have an account? </Text>
              <Text
                style={[
                  styles.LinkButton,
                  { fontWeight: "bold", color: "#D1AE6C" },
                ]}
              >
                Sign in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signIn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomLogoContainer: {
    marginBottom: 30,
  },
  bottomLogo: {
    height: 120 * responsive(),
    width: 120 * responsive(),
  },
  container_child: {
    backgroundColor: "#000000c0",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 10,
    fontFamily: "Inter_700Bold",
  },
  text_dis: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16 * responsive(),
    marginBottom: 20,
    fontFamily: "Inter_400Regular",
  },
  input: {
    minWidth: 300 * responsive(),
    minHeight: 40 * responsive(),
    borderColor: "#ddd",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    marginBottom: 18,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 3,
    color: "#000000",
    fontSize: 14,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    fontFamily: "Inter_400Regular",
  },
  LinkButton: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 14 * responsive(),
  },
  SubmitButton: {
    minWidth: 300,
    minHeight: 50,
    padding: 7,

    backgroundColor: "#D1AE6C",
    borderRadius: 40,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "center",
  },
  SubmitButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
    fontWeight: "bold",
  },
  scrollStyle: {
    flex: 1,
    height: "auto",
  },
  phoneContainerStyle: {
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 18,
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
    maxWidth: 300 * responsive(),
    maxHeight: 40 * responsive(),
    borderRadius: 3,
  },
  textInputStyle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
    color: "#000000",
    height: 20 * responsive(),
  },
  codeTextStyle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
    color: "#000000",
    height: 20 * responsive(),
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
