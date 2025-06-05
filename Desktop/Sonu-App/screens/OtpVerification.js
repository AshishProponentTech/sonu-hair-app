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
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { OtpVerificationRequest, ResendOtpRequest } from "../service/Otp";
import Spinner from "react-native-loading-spinner-overlay";
import configResponse from "../config/constant";
import Background from "../assets/images/background/Hair_Salon_Stations.jpg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash.png";
import { responsive } from "../helper/responsive";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
function OtpVerification({ navigation }) {
  const route = useRoute();
  const { username } = route.params;
  const [otp, onChangeOtp] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  // const dispatch = useDispatch();
  const [showOtp, setShowOtp] = React.useState(false);
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  React.useEffect(() => {
    if (username) {
      if (isNumber(username)) {
        setEmail(() => username);
      } else {
        setEmail(() => username);
      }
    }
  }, []);

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
              // alignSelf: "center",
              width: "100%",
            }}
            source={splash}
          />
        </View>
      </>
    );
  }

  const OtpUpRequest = () => {
    if (!otp) {
      return configResponse.errorMSG("Enter otp");
    }
    const data = `otp=${otp}`;
    setIsLoading(true);
    OtpVerificationRequest(data, token)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200 || response?.status == 201) {
          onChangeOtp(null);
          navigation.navigate("NewPasswordCreate", { token: token });
        } else if (response?.status == 400 || response?.status == 500) {
          configResponse.errorMSG(response.data.errors);
        } else if (response?.status == 401) {
          configResponse.errorMSG(response.data.message);
        } else {
          const resultError = response?.data?.errors;
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
  };

  const resendOtp = () => {
    setIsLoading(true);
    ResendOtpRequest(token)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200 || response?.status == 201) {
          configResponse.successMSG(response.data.message);
        } else {
          configResponse.errorMSG(response.data.errors);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };

  const forgetPassword = async () => {
    try {
      if (isNaN(email)) {
        const config = {
          method: "POST",
          url: `${configResponse.baseURL}/auth/forgotPassword`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Connection: `keep-alive`,
          },

          data: {
            email: email,
          },
        };
        const { data } = await axios.request(config);
        console.log("data if", data);

        if (data.status) {
          setToken(data.token);
          setShowOtp(true);
        }
      } else {
        const config = {
          method: "POST",
          url: `${configResponse.baseURL}/auth/forgotPassword`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Connection: `keep-alive`,
          },

          data: {
            phone: email,
          },
        };
        const { data } = await axios.request(config);
        console.log("data else", data);

        if (data.status) {
          setToken(data.token);
          setShowOtp(true);
        }
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Background}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container_child}>
          {showOtp ? (
            <View style={styles.container_mid}>
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{
                  height: 250 * responsive(),
                  width: 250 * responsive(),
                  // borderWidth: 1,
                  // borderColor: "white",
                  width: "100%",
                }}
              />
              <Spinner
                visible={isLoading}
                textContent={"Loading..."}
                textStyle={styles.spinnerTextStyle}
              />
              <Text style={styles.heading}>OTP Verification</Text>
              <Text style={styles.text_dis}>
                Please enter the verification code sent to your registered Email
                Address
              </Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#808080"
                onChangeText={onChangeOtp}
                value={otp}
                placeholder="Enter OTP"
              />
              <Pressable onPressIn={OtpUpRequest} style={styles.SubmitButton}>
                <Text style={styles.SubmitButtonText}>Confirm OTP </Text>
              </Pressable>
              <Pressable onPressIn={resendOtp}>
                <Text style={styles.LinkButton}>Resend OTP</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.backButtonText}>Back to Login</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.container_mid}>
              <Spinner
                visible={isLoading}
                textContent={"Loading..."}
                textStyle={styles.spinnerTextStyle}
              />
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{
                  height: 250 * responsive(),
                  width: 250 * responsive(),
                  // borderWidth: 1,
                  // borderColor: "white",
                  width: "100%",
                }}
              />
              <Text style={styles.heading}>ForgetPassword </Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#808080"
                placeholder="Enter Email/Phone"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <Pressable
                style={styles.SubmitButton}
                onPress={() => forgetPassword()}
              >
                <Text style={styles.SubmitButtonText}>Send</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
export default OtpVerification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_child: {
    backgroundColor: "#000000c0",
    display: "flex",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    //paddingTop: 50,
  },
  container_mid: {
    padding: 0,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 16 * responsive(),
    textAlign: "center",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 20,
    fontFamily: "Inter_700Bold",
  },
  text_dis: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16 * responsive(),
    marginBottom: 16,
    fontFamily: "Inter_400Regular",
  },
  input: {
    borderColor: "#ddd",
    backgroundColor: "#ffffff",
    width: "100%",
    height: 50,
    borderWidth: 1,
    marginBottom: 18,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 2,
    color: "#000000",
    fontSize: 16 * responsive(),
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    fontFamily: "Inter_400Regular",
  },
  LinkButton: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
  },
  SubmitButton: {
    width: 300,
    padding: 10,
    backgroundColor: "#D1AE6C",
    borderRadius: 3,
    width: 300,
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    marginTop: 20,
  },
  SubmitButtonText: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 18 * responsive(),
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  backButtonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
    marginBottom: 20,
  },
});
