import * as React from "react";
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import Spinner from "react-native-loading-spinner-overlay";
// constants
import configResponse from "../config/constant";
// services
import { ResendOtpRequest } from "../service/Otp";
import { AuthContext } from "../helper/AuthContext";
import Background from "../assets/images/background/SplashBackground.png";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash.png";
import { responsive } from "../helper/responsive";

function LoginOtpVerification({ route, navigation }) {
  const [otp, onChangeOtp] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn } = React.useContext(AuthContext);
  const [resendOTPTimer, setResendOTPTimer] = React.useState(60);
  const [isResendDisabled, setIsResendDisabled] = React.useState(false);
  const { token } = route.params;
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  React.useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setResendOTPTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 60; 
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const OtpUpRequest = () => {
    if (!otp) {
      return configResponse.errorMSG("Please enter the OTP");
    }
    const data = `otp=${otp}`;

    setIsLoading(true);
    signIn(data, token)
      .then((res) => {
        setIsLoading(false);
        onChangeOtp(null);
      })
      .catch((err) => {});
  };
  const resendOtp = () => {
    setIsLoading(true);
    ResendOtpRequest(token)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200 || response?.status == 201) {
          configResponse.successMSG(response.data.message);
          setIsResendDisabled(true);
        } else if (response?.data?.status == 401) {
          configResponse.errorMSG(response.data.message);
        } else {
          configResponse.errorMSG(response.data.errors);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!fontsLoaded) {
    return (
        <View style={{ backgroundColor: "black" }}>
          <Image
            resizeMode="contain"
            style={{
              height: hp("100%"),
              backgroundColor: "black",
              display: "flex",
            }}
            source={splash}
          />
        </View>
    );
  }
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
      enabled
    >
      <ImageBackground
        source={Background}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container_child}>
          <View style={styles.container_mid}>
            <Spinner
              visible={isLoading}
              textContent={"Loading..."}
              textStyle={styles.spinnerTextStyle}
            />
            <Text style={styles.heading}>OTP Verification</Text>
            <Text style={styles.text_dis}>
              Please enter the verification code sent to your registered Email / Phone
              number</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#808080"
              onChangeText={onChangeOtp}
              value={otp}
              placeholder="Enter OTP"
            />
            <Pressable onPressIn={OtpUpRequest} style={styles.SubmitButton}>
              <Text style={styles.SubmitButtonText}>Confirm OTP</Text>
            </Pressable>
            <Pressable
                onPressIn={resendOtp}
                disabled={isResendDisabled}
              >
                <Text style={styles.LinkButton}>
                  {isResendDisabled ? `Resend OTP in ${formatTime(resendOTPTimer)}` : "Resend OTP"}
                </Text>
              </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Login")}
              style={styles.backArrowContainer}
            >
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
LoginOtpVerification.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};
export default LoginOtpVerification;

const styles = StyleSheet.create({
  container: {},
  container_child: {
    backgroundColor: "#000000c0",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container_mid: {
    padding: 10,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26 * responsive(),
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
    marginBottom: 16,
    fontFamily: "Inter_400Regular",
    marginTop: 25,
  },
  input: {
    borderColor: "#ddd",
    backgroundColor: "#ffffff",
    width: Math.min(wp("90%"), 500),
    padding: 14 * responsive(),
    borderWidth: 1,
    marginBottom: 18,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 2,
    color: "#000000",
    fontSize: 16 * responsive(),
    fontFamily: "Inter_400Regular",
  },
  LinkButton: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
  },
  SubmitButton: {
    backgroundColor: "#D1AE6C",
    borderRadius: 40,
    width: 300,
    padding: 10 * responsive(),
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    marginTop: 20,
  },
  SubmitButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 18 * responsive(),
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  backArrowContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 24,
    color: "#fff",
  },
});
