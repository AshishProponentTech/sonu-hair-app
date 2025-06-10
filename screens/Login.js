import { useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image,
  Pressable,
  StatusBar,
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import Spinner from "react-native-loading-spinner-overlay";
import configResponse from "../config/constant";
import { loginUpRequest } from "../service/User";
import logo from "../assets/logo2.png";
import Background from "../assets/images/background/SplashBackground.png";
import { AppStateContext } from "../helper/AppStateContaxt";
import { RadioButton, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsive } from "../helper/responsive";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmailIcon = (props) => <Icon name="account" size={24} color="#D1AE6C" {...props} />;

function Login({ navigation }) {
  const { setGuestMode } = useContext(AppStateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  useEffect(() => {
    const setRescheduleAppointment = async () => {
      try {
        await AsyncStorage.setItem("appointment_id", "0");
      } catch (error) {
        console.error("Error occurred while setting appointment ID:", error);
      }
    };
    setRescheduleAppointment();
  }, []);

  const isNumber = value => /^\d+$/.test(value);

  const LoginRequest = () => {
    if (!username) {
      return configResponse.errorMSG(`Please enter your phone number or email`);
    }
    setIsLoading(true);
    const data = isNumber(username)
      ? { phone: username, otp: true }
      : { email: username, otp: true };
    loginUpRequest(data)
      .then(async (response) => {
        setIsLoading(false);
        if (response?.status === 200) {
          setGuestMode(false);
          configResponse.successMSG(response.data.message);
          navigation.navigate("LoginOtpVerification", {
            token: response?.data?.token,
            ...(isNumber(username) && { phone: username }),
          });
        } else if (response.data?.errors?.validate?.phone) {
          configResponse.errorMSG(response.data.errors.validate.phone[0]);
        } else if (response.data?.errors?.validate?.email) {
          configResponse.errorMSG(response.data.errors.validate.email[0]);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        configResponse.errorMSG(error.message || "Failed to send OTP");
      });
  };

  const handleGuestMode = () => {
    navigation.navigate("DrawerMenu");
    setGuestMode(true);
  };
  const loginType = () => {
    return (
      <View style={{ width: "80%" }}>
        <TextInput
          style={styles.loginInput}
          placeholder="Enter Email or phone number"
          placeholderTextColor="black"
          mode="outlined"
          value={username}
          onChangeText={setUsername}
          theme={{ color: "#333333" }}
          textColor="black"
          left={
           <TextInput.Icon icon={EmailIcon} />
          }
        />
        <Pressable
          onPressIn={LoginRequest}
          style={[styles.SubmitButton, { marginBottom: 10 }]}
        >
          <Text style={styles.SubmitButtonText}>Send OTP</Text>
        </Pressable>
      </View>
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={{ backgroundColor: "black" }}>
        <Image
          resizeMode="cover"
          style={{
            height: hp("100%"),
            backgroundColor: "black",
            display: "flex",
            width: wp("100%"),
            alignSelf: "center",
          }}
          source={Background}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#272727" barStyle="dark-content" />
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
            <View style={styles.bottomLogoContainer}>
              <Image source={logo} style={styles.bottomLogo} />
            </View>
            <Text style={styles.heading}>Welcome</Text>
            <View style={styles.select}>
              <Text style={[styles.text_dis, { fontWeight: "bold" }]}>Login As</Text>
              <View style={styles.radioWrapper}>
                <RadioButton.Android value="client" color="#D1AE6C" status="checked" />
                <Text style={styles.selectText}>Client</Text>
              </View>
              <View style={styles.radioWrapper}>
                <RadioButton.Android
                  value="staff"
                  status="unchecked"
                  color="#D1AE6C"
                  onPress={() => navigation.navigate("StaffMain")}
                />
                <Text style={styles.selectText}>Staff</Text>
              </View>
            </View>
            {loginType()}
            <Text style={[styles.text_dis, { marginVertical: 10 }]}>OR</Text>
            <Pressable
              onPressIn={handleGuestMode}
              style={[styles.guestBtn, { marginTop: 0 }]}
            >
              <Text style={styles.guestBtnText}>Guest User</Text>
            </Pressable>
            <Pressable
              style={styles.signUp}
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            >
              <Text style={[styles.LinkButton, { marginRight: 5 }]}>
                Don't have an account ?
              </Text>
              <Text
                style={[
                  styles.LinkButton,
                  { fontWeight: "bold", color: "#D1AE6C" },
                ]}
              >Create Your Account</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginInput: {
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 16,
    width: "100%",
  },
  signUp: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 100,
  },
  bottomLogoContainer: {
    margin: 40,
  },
  bottomLogo: {
    height: 140 * responsive(),
    width: 140 * responsive(),
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
    fontSize: 26 * responsive(),
    textAlign: "center",
    fontWeight: "700",
    color: "#D2AE6A",
    marginBottom: 10,
    fontFamily: "Inter_700Bold",
  },
  text_dis: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16 * responsive(),
    fontFamily: "Inter_400Regular",
  },
  phoneContainerStyle: {
    borderColor: "#ddd",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 400 * responsive(),
    borderRadius: 3,
    marginTop: 20,
  },
  textInputStyle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14 * responsive(),
    width: "90%",
    color: "#000000",
    height: 20,
  },
  codeTextStyle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14 * responsive(),
    color: "#000000",
  },
  LinkButton: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginTop: 25,
  },
  SubmitButton: {
    minWidth: 300 * responsive(),
    padding: 14 * responsive(),
    backgroundColor: "#D2AE6A",
    borderRadius: 40,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },
  guestBtn: {
    minWidth: 300 * responsive(),
    padding: 14 * responsive(),
    borderRadius: 40,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ffff",
  },
  SubmitButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    fontWeight: "bold",
  },
  guestBtnText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    fontWeight: "bold",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  select: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 20,
    marginBottom: 20,
  },
  radioWrapper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  selectText: {
    color: "white",
    fontSize: 14 * responsive(),
  },
});