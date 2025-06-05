import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import PhoneInput from "react-native-phone-number-input";
import Spinner from "react-native-loading-spinner-overlay";
import configResponse from "../config/constant";
import { loginUpRequest } from "../service/User";
import logo from "../assets/logo2.png";
import Background from "../assets/splash-new.jpg";
import { AppStateContext } from "../helper/AppStateContaxt";
import { RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash-new.jpg";
import { responsive } from "../helper/responsive";
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch } from "react-redux";
import { AuthContext } from "../helper/AuthContext";
import { isTablet } from "../components/tablet";
function Login({ navigation }) {
  const { setGuestMode, guestMode } = React.useContext(AppStateContext);
  const { signInByEmail } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [phone, onChangePhone] = React.useState(null);
  const [country_code, setCode] = React.useState(1);
  const phoneInput = React.useRef(null);
  const [formattedValue, setFormattedValue] = React.useState("");
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState("");
  const [err, setError] = React.useState("");
  const [selectLoginTypeOtp, setSelectLoginTypeOtp] = React.useState(false);
  const [selectLoginTypeStatus, setSelectLoginStatus] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  const dispatch = useDispatch();
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const setRescheduleAppointment = async () => {
    try {
      const idString = String(0);
      await AsyncStorage.setItem("appointment_id", idString);
    } catch (error) {
      console.error("Error occurred while setting appointment ID:", error);
    }
  };
  if (!fontsLoaded) {
    setRescheduleAppointment();

    return (
      <>
        <View style={{ backgroundColor: "black" }}>
          <Image
            resizeMode="cover"
            style={
              isTablet()
                ? {
                    height: hp("100%"),
                    backgroundColor: "black",
                    display: "flex",
                    width: wp("100%"),
                    alignSelf: "center",
                  }
                : {
                    height: hp("100%"),
                    backgroundColor: "black",
                    display: "flex",
                    width: wp("100%"),
                    alignSelf: "center",
                  }
            }
            source={splash}
          />
        </View>
      </>
    );
  }

  const LoginRequest = (type) => {
    if (type == "EmailPassword") {
      if (!username) {
        configResponse.errorMSG("Please Enter Your UserName/PhoneNumber");
      } else if (!password) {
        configResponse.errorMSG("Please enter your password.");
      } else {
        setIsLoading(true);
        const data = {
          email: username,
          password: password,
          otp: false,
        };
        signInByEmail(data).then((res) => {
          setIsLoading(false);
          onChangePhone(null);
          setGuestMode(false);
        });
      }
    } else if (type == "PhonePassword") {
      if (!username) {
        configResponse.errorMSG("Please Enter Your UserName/PhoneNumber");
      } else if (!password) {
        configResponse.errorMSG("Please enter your password");
      } else {
        setIsLoading(true);
        const data = {
          phone: username,
          password: password,
          otp: false,
        };
        signInByEmail(data).then((res) => {
          setIsLoading(false);
          onChangePhone(null);
          setGuestMode(false);
        });
      }
    } else if (type == "EmailOtp") {
      setIsLoading(true);
      const data = {
        email: username,
        otp: true,
      };
      loginUpRequest(data)
        .then(async (response) => {
          setIsLoading(false);
          if (response?.status == 200) {
            onChangePhone(null);
            setGuestMode(false);
            //configResponse.successMSG(response.data.message);

            navigation.navigate("LoginOtpVerification", {
              token: response?.data?.token,
            });
          } else {
            // configResponse.errorMSG(response.data.errors);
            if (response.data.errors) {
              if (response.data.errors.validate.email[0]) {
                configResponse.errorMSG(response.data.errors.validate.email[0]);
              }
            }
          }
        })
        .catch((error) => {
          setIsLoading(false);
          //configResponse.errorMSG(error.message);
        });
    } else if (type == "PhoneOtp") {
      if (!country_code) {
        return configResponse.errorMSG(
          `Enter phone number or select country code`
        );
      }
      //if (!phone)
      if (!username) {
        return configResponse.errorMSG(`Please enter your phone number`);
      }
      setIsLoading(true);
      const data = {
        //phone,
        phone: username,
        otp: true,
      };
      loginUpRequest(data)
        .then(async (response) => {
          setIsLoading(false);
          if (response?.status == 200) {
            onChangePhone(null);
            setGuestMode(false);
            configResponse.successMSG(response.data.message);
            navigation.navigate("LoginOtpVerification", {
              token: response?.data?.token,
            });
          } else {
            // configResponse.errorMSG(response.data.errors);
            if (response.data.errors.validate.phone) {
              configResponse.errorMSG(response.data.errors.validate.phone[0]);
            }
          }
        })
        .catch((error) => {
          setIsLoading(false);

          //configResponse.errorMSG(error.message);
        });
    }
  };

  const handleGuestMode = () => {
    navigation.navigate("DrawerMenu");
    setGuestMode(true);
  };
  const onChangeUserName = (name) => {
    setError("");
    setUsername(name);
  };

  // const onPasswordChange = (pass) => {
  //   setError("");
  //   setPassword(pass);
  // };
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const loginType = () => {
    const placeholderText = selectLoginTypeStatus ? "Phone Number" : "Email";

    if (isNumber(username)) {
      //console.log("data", selectLoginTypeOtp);
      if (selectLoginTypeOtp) {
        // console.log("Phone");

        return (
          <View style={{ width: "80%" }}>
            {/* <PhoneInput
              ref={phoneInput}
              value={phone}
              defaultCode="CA"
              layout="first"
              onChangeText={(text) => onChangePhone(text)}
              onChangeFormattedText={(text) => setFormattedValue(text)}
              onChangeCountry={(country) => setCode(country.callingCode[0])}
              containerStyle={styles.phoneContainerStyle}
              textInputStyle={styles.textInputStyle}
              codeTextStyle={styles.codeTextStyle}
              textStyle={{ width: 200 }}
              textProps={{ placeholder: "Enter Phone number" }}
            /> */}

            <TextInput
              style={styles.loginInput}
              placeholder={placeholderText}
              placeholderTextColor="black"
              mode="outlined"
              value={username}
              onChangeText={(text) => {
                onChangeUserName(() => text);
                onChangePhone(() => text);
              }}
              theme={{ color: "#333333" }}
              textColor="black"
            />

            <Pressable
              onPressIn={() => {
                LoginRequest("PhoneOtp"), setRescheduleAppointment();
              }}
              style={[styles.SubmitButton, { marginBottom: 10 }]}
            >
              <Text style={styles.SubmitButtonText}>Send Otp</Text>
            </Pressable>
            <TouchableOpacity
              style={[
                styles.guestBtn,
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                },
              ]}
              disabled={username ? false : true}
              onPress={() => setSelectLoginTypeOtp(false)}
            >
              <Entypo name="arrow-long-left" size={20} color={"white"} />
              <Text style={styles.guestBtnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={{ width: "80%"}}>
            <TextInput
              style={styles.loginInput}
              placeholder={"Enter your mobile number"}
              placeholderTextColor="black"
              mode="outlined"
              value={username}
              onChangeText={onChangeUserName}
              theme={{ color: "#333333" }}
              textColor="black"
            />
            {/* <TextInput
              style={styles.loginInput}
              placeholder="Password"
              placeholderTextColor="black"
              mode="outlined"
              value={password}
              onChangeText={onPasswordChange}
              theme={{ color: "#333333" }}
              textColor="black"
              secureTextEntry={true}
            /> */}
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            > */}
            {/* <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{ textAlign: "center", color: "#FFC000" }}
                  disabled={username ? false : true}
                  onPress={() =>
                    navigation.navigate("OtpVerification", {
                      username: username,
                    })
                  }
                >
                  Forgot Password ?
                </Text>
              </TouchableOpacity> */}
            {/* <TouchableOpacity
                style={{
                  color: "#FFC000",
                  padding: 10,
                  borderRadius: 10,
                  width: "30%",
                  alignSelf: "flex-end",
                  borderWidth: 1,
                  borderColor: "#FFC000",
                }}
                disabled={username ? false : true}
                onPress={() => {
                  setSelectLoginStatus(() => true),
                    setSelectLoginTypeOtp(() => true);
                }}
              >
                <Text
                  style={{ textAlign: "center", color: "#FFC000" }}
                  disabled={username ? false : true}
                  onPress={() => {
                    setSelectLoginStatus(() => true),
                      setSelectLoginTypeOtp(() => true);
                  }}
                >
                  Login OTP
                </Text>
              </TouchableOpacity> */}
            {/* </View> */}
            <Pressable
              onPressIn={() => {
                LoginRequest("PhoneOtp"), setRescheduleAppointment();
              }}
              style={styles.SubmitButton}
            >
              <Text style={styles.SubmitButtonText}>Send OTP</Text>
            </Pressable>
          </View>
        );
      }
    } else {
      if (selectLoginTypeOtp) {
        return (
          <View style={{ width: "80%", alignSelf: "center" }}>
            <TextInput
              style={styles.loginInput}
              placeholder={placeholderText}
              placeholderTextColor="black"
              mode="outlined"
              value={username}
              onChangeText={onChangeUserName}
              theme={{ color: "#333333" }}
              textColor="black"
            />
            {/* <TouchableOpacity
              style={{
                color: "#FFC000",
                padding: 10,
                borderRadius: 10,
                width: "30%",
                alignSelf: "flex-end",
                backgroundColor: "#FFC000",
              }}
              disabled={username ? false : true}
              onPress={() => setSelectLoginTypeOtp(false)}
            >
              <Text style={{ textAlign: "center", color: "#FFC000" }}>
                <Entypo name="arrow-long-left" size={20} color={"black"} />
              </Text>
            </TouchableOpacity> */}
            <Pressable
              onPressIn={() => {
                LoginRequest("EmailOtp"), setRescheduleAppointment();
              }}
              style={[styles.SubmitButton, { marginBottom: 10 }]}
            >
              <Text style={styles.SubmitButtonText}>Send Otp</Text>
            </Pressable>
            <TouchableOpacity
              // style={{
              //   color: "#FFC000",
              //   padding: 10,
              //   borderRadius: 10,
              //   width: "30%",
              //   // height: "100%",
              //   alignSelf: "center",
              //   // backgroundColor: "#FFC000",
              //   marginTop: 10,
              //   alignItems: "center",
              //   flexDirection: "row",
              //   gap: 4,
              // }}
              style={[
                styles.guestBtn,
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                },
              ]}
              // disabled={username ? false : true}
              onPress={() => setSelectLoginTypeOtp(false)}
            >
              <Entypo name="arrow-long-left" size={20} color={"white"} />
              <Text
                // style={{
                //   textAlign: "center",
                //   color: "white",
                //   alignItems: "center",
                // }}
                style={styles.guestBtnText}
              >
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={{ width: "80%" }}>
            <TextInput
              style={styles.loginInput}
              placeholder={"Enter your mobile number"}
              placeholderTextColor="black"
              mode="outlined"
              value={username}
              onChangeText={onChangeUserName}
              theme={{ color: "#333333" }}
              textColor="black"
            />
            {/* <TextInput
              style={styles.loginInput}
              placeholder="Password"
              placeholderTextColor="black"
              mode="outlined"
              value={password}
              onChangeText={onPasswordChange}
              theme={{ color: "#333333" }}
              textColor="black"
              secureTextEntry={true}
            /> */}
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{ textAlign: "center", color: "#FFC000" }}
                  disabled={username ? false : true}
                  onPress={() =>
                    navigation.navigate("OtpVerification", {
                      username: username,
                    })
                  }
                >
                  Forgot Password ?
                </Text>
              </TouchableOpacity> */}
            {/* <TouchableOpacity
                style={{
                  color: "#FFC000",
                  padding: 10,
                  borderRadius: 10,
                  width: "30%",
                  alignSelf: "flex-end",
                  borderWidth: 1,
                  borderColor: "#FFC000",
                }}
                disabled={username ? false : true}
                onPress={() => {
                  setSelectLoginStatus(() => false),
                    setSelectLoginTypeOtp(() => true);
                }}
              >
                <Text
                  style={{ textAlign: "center", color: "#FFC000" }}
                  disabled={username ? false : true}
                  onPress={() => {
                    setSelectLoginStatus(() => false),
                      setSelectLoginTypeOtp(() => true);
                  }}
                >
                  Login OTP
                </Text>
              </TouchableOpacity> */}
            {/* </View> */}
            <Pressable
              onPressIn={() => {
                LoginRequest("EmailPassword"), setRescheduleAppointment();
              }}
              style={styles.SubmitButton}
            >
              <Text style={styles.SubmitButtonText}>Send OTP</Text>
            </Pressable>
          </View>
        );
      }
    }

    return;
  };

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

            <Text style={styles.heading}>Welcome </Text>
            <View style={styles.select}>
              <Text
                style={[
                  styles.text_dis,
                  { fontWeight: "bold", paddingRight: 20 },
                ]}
              >
                Login As
              </Text>
              <View style={styles.radioWrapper}>
                <RadioButton.Android
                  value="first"
                  color="#D1AE6C"
                  status={"checked"}
                />
                <Text style={styles.selectText}>Client</Text>
              </View>
              <View style={styles.radioWrapper}>
                <RadioButton.Android
                  value="first"
                  status={"unchecked"}
                  color="#D1AE6C"
                  onPress={() => {
                    navigation.navigate("StaffMain");
                  }}
                />
                <Text style={styles.selectText}>Staff</Text>
              </View>
            </View>
            {showLogin ? (
              loginType()
            ) : (
              <View style={{ width: "80%"}}>
                <TextInput
                  style={[styles.loginInput, { borderWidth: 1 }]}
                  placeholder="Enter your mobile number"
                  placeholderTextColor="black"
                  mode="outlined"
                  keyboardType="numeric"
                  value={username}
                  onChangeText={onChangeUserName}
                  theme={{ color: "#333333" }}
                  textColor="black"
                />
                <Pressable
                  onPressIn={() => {
                    LoginRequest("PhoneOtp"), setRescheduleAppointment();
                  }}
                  style={[styles.SubmitButton, { marginBottom: 10 }]}
                >
                  <Text style={styles.SubmitButtonText}>Login via OTP</Text>
                </Pressable>
                {/* <TouchableOpacity
                  style={[
                    styles.guestBtn,
                    {
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 4,
                    },
                  ]}
                  disabled={username ? false : true}
                  onPress={() => {
                    if (validatePhoneNumber(username)) {
                      setShowLogin(() => true);
                    } else {
                      configResponse.errorMSG("Enter a valid phone number");
                    }
                  }}
                >
                  <Text
                    style={styles.guestBtnText}
                    disabled={username ? false : true}
                    onPress={() => setShowLogin(() => true)}
                  >
                    Next
                  </Text>
                  <Entypo name="arrow-long-right" size={20} color={"white"} />
                </TouchableOpacity> */}
              </View>
            )}

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
              >
                Create Your Account
              </Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginInput: {
    marginVertical: 10,
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 4,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 10,
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
    //color: "#FFC000",
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
