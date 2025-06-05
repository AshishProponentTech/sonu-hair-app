import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Pressable,
  TextInput,
  ToastAndroid,
  PixelRatio,
  Dimensions,
} from "react-native";
// packages imports
import * as SecureStore from "expo-secure-store";
// import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import Spinner from "react-native-loading-spinner-overlay";
// constants
import configResponse from "../config/constant";
// services imports
import { VerifyAccountRequest } from "../service/User";
// image imports
import Background from "../assets/images/background/Hair_Salon_Stations.jpg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash.png";
import Toast from "react-native-root-toast";
import { responsive } from "../helper/responsive";

function AccountVerification({ navigation, route }) {
  const [email, onChangeEmail] = React.useState(
    route.params.useremail ? route.params.useremail : null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  let [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
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

  const ForgotPasswordRequestClick = () => {
    if (!email) {
      configResponse.errorMSG("Please enter email id");
      return;
    }

    const data = `email=${email}`;
    setIsLoading(true);
    VerifyAccountRequest(data)
      .then(async (response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          // ToastAndroid.show(response?.data?.message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
          Toast.show(response?.data?.message, {
            duration: Toast.durations.LONG,
          });
          await SecureStore.setItemAsync("token", response?.data?.token);
          navigation.navigate("OtpVerification", { nextpageurl: "Login" });
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
            <Text style={styles.heading}>Email Verification</Text>
            <Text style={styles.text_dis}>
              Please verify your email address
            </Text>

            <TextInput
              style={styles.input}
              placeholderTextColor="#ffffff"
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Email address"
            />
            <Pressable
              onPressIn={ForgotPasswordRequestClick}
              style={styles.SubmitButton}
            >
              <Text style={styles.SubmitButtonText}>Send OTP</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default AccountVerification;

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
    fontSize: 13 * responsive(),
    marginBottom: 10,
    marginTop: 10,
    fontFamily: "Inter_400Regular",
  },
  input: {
    width: 300,
    borderColor: "#ddd",
    height: 35,
    borderWidth: 1,
    marginBottom: 18,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 2,
    color: "#ffffff",
    fontSize: 16 * responsive(),
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingLeft: 10,
    fontFamily: "Inter_400Regular",
  },
  LinkButton: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  SubmitButton: {
    width: 200,
    padding: 10,
    backgroundColor: "#00a3ad",
    borderRadius: 3,
    color: "#fff",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    marginTop: 20,
  },
  SubmitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
