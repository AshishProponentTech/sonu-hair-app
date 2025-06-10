import { useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
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
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash.png";
import { responsive } from "../helper/responsive";
import * as Yup from "yup";

function SignUp({ navigation }) {
  const { setGuestMode } = useContext(AppStateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [password, setPassword] = useState(null);

  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState("");

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
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
    );
  }
  const validateFields = async ({ firstName, lastName, email, password, formattedValue }) => {
    if (!firstName) throw new Error("Enter first name");
    if (!lastName) throw new Error("Enter last name");
    if (!email) throw new Error("Enter email id");
    if (!password) throw new Error("Enter Password");
    if (!formattedValue) throw new Error("Please enter your phone number");

    await Yup.object({
      firstName: Yup.string()
        .matches(/^[a-zA-Z]+$/, "First Name should only contain letters")
        .required("First Name is required"),
      lastName: Yup.string()
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
    }).validate({ firstName, lastName, email, password });
  };

  const handleErrorResponse = (response) => {
    if (response.data.errors) {
      if (response.data.errors.email) {
        configResponse.errorMSG(response.data.errors.email[0]);
        return true;
      }
      if (response.data.errors.phone) {
        configResponse.errorMSG(response.data.errors.phone[0]);
        return true;
      }
      if (response.data.errors.validate) {
        const errorlist = Object.values(response.data.errors.validate).join('\n');
        configResponse.errorMSG(errorlist);
        return true;
      }
    }
    return false;
  };

  const SignUpRequest = async () => {
    try {
      await validateFields({ firstName, lastName, email, password, formattedValue });

      setIsLoading(true);

      const data = {
        firstName,
        lastName,
        email,
        phone,
        country_code: "+91",
        password,
        dial_code: phoneInput.current?.getCountryCode(),
      };

      const response = await signUpRequest(data);
      setIsLoading(false);

      if (response?.status === 200 || response?.status === 201) {
        setFirstName(null);
        setLastName(null);
        setEmail(null);
        setPhone(null);
        setGuestMode(false);
        navigation.navigate("LoginOtpVerification", {
          token: response?.data?.data?.token,
        });
        return;
      }

      if (!handleErrorResponse(response)) {
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
              onChangeText={setFirstName}
              value={firstName}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#808080"
              onChangeText={setLastName}
              value={lastName}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#808080"
              onChangeText={setEmail}
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
                setPhone(text);
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
              >Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
SignUp.propTypes = {
  navigation: PropTypes.object.isRequired,
};
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
    fontSize: 18,
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
    minHeight: 45 * responsive(),
    borderColor: "#ddd",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    marginBottom: 18,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
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
