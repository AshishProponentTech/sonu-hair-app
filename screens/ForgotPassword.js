import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Pressable,
  ToastAndroid,
  PixelRatio,
  Image,
} from "react-native";
// dependencies imports
// import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as SecureStore from "expo-secure-store";
import PhoneInput from "react-native-phone-number-input";
import Spinner from "react-native-loading-spinner-overlay";
// constants imports
import configResponse from "../config/constant";
// images imports
import Background from "../assets/images/background/Hair_Salon_Stations.jpg";
// services imports
import { ForgotPasswordRequest } from "../service/User";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash.png";
import Toast from "react-native-root-toast";
import { responsive } from "../helper/responsive";

function ForgotPassword({ navigation }) {
  const [phone, onChangePhone] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
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
            resizeMode="contain"
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
  const ForgotPasswordRequestClick = () => {
    const country_code = formattedValue;
    if (!country_code) {
      return configResponse.errorMSG(
        `Enter phone number or select country code`
      );
    }
    const data = `phone=${phone}&country_code=${country_code}`;
    setIsLoading(true);
    ForgotPasswordRequest(data)
      .then(async (response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          // ToastAndroid.show(response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
          Toast.show(response.data.message, {
            duration: Toast.durations.LONG,
          });
          await SecureStore.setItemAsync("token", response.data.token);
          navigation.navigate("OtpVerification", {
            nextpageurl: "NewPasswordCreate",
          });
        } else {
          configResponse.errorMSG(response?.data?.errors);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Background}
        resizeMode="cover"
        style={styles.image}
      >
        <Spinner
          visible={isLoading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.container_child}>
          <View style={styles.container_mid}>
            <Text style={styles.heading}>Forgot Password ?</Text>
            <Text style={styles.text_dis}>
              You can reset your password here
            </Text>
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
            <Pressable
              onPressIn={ForgotPasswordRequestClick}
              style={styles.SubmitButton}
            >
              <Text style={styles.SubmitButtonText}>Send OTP</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.LinkButton}>Remember password? Login</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ForgotPassword;

// StyleSheet
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
    marginBottom: 10,
    fontFamily: "Inter_400Regular",
  },
  phoneContainerStyle: {
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 18,
    marginLeft: "auto",
    marginRight: "auto",
    width: 340,
    height: 50,
    borderRadius: 3,
  },
  textInputStyle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
    color: "#000000",
    height: 20,
  },
  codeTextStyle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16 * responsive(),
    color: "#000000",
    top: -4,
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
    backgroundColor: "##D1AE6C",
    borderRadius: 3,
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
});
