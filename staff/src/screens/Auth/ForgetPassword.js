import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  BackHandler,
  Dimensions,
  SafeAreaView,
  ImageBackground
} from "react-native";
import { TextInput, Headline, Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { toggleTheme, saveUserToken } from "../../actions";
import { baseURL } from "../../constants";
import axios from "axios";
import { responsive } from "../../../../helper/responsive";
import Background from "../../../assets/images/background/SplashBackground.png";
import logo from "../../../assets/logo2.png";
import Spinner from "react-native-loading-spinner-overlay";


function ForgetPassword(props) {
  const userName = props.route.params.email;

  const [stepCount, setsteps] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const [rightIcon, setRightIcon] = useState("eye");
  const [confirmIcon, setConfirmIcon] = useState("eye");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmVisibility, setConfirmVisibility] = useState(true);

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const handleConfirmPasswordVisibility = () => {
    if (confirmIcon === "eye") {
      setConfirmIcon("eye-off");
      setConfirmVisibility(!confirmVisibility);
    } else if (confirmIcon === "eye-off") {
      setConfirmIcon("eye");
      setConfirmVisibility(!confirmVisibility);
    }
  };

  const StepOne = () => {
    const [email, setEmail] = useState(userName);
    async function sendOtp() {
      setLoading(true);
      setError("");
      try {
        const config = {
          method: "POST",
          url: `${baseURL}/staff/forgotPassword`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Connection: `keep-alive`,
          },
          data: { email: email },
        };
        const { data } = await axios.request(config);
        if (data.status) {
          setToken(data.token);
          setLoading(false);
          setsteps(2);
        }
      } catch (error) {
        setLoading(false);
        setError("Server Not Responding");
      }
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
              visible={loading}
              textContent={"Loading..."}
              textStyle={styles.spinnerTextStyle}
            />
            <View style={styles.loginWrapper}>
              <View style={styles.bottomLogoContainer}>
                <Image source={logo} style={styles.bottomLogo} />
              </View>
              <Text style={styles.heading}>Confirm Email</Text>
              {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}
              <TextInput
                style={styles.loginInput}
                label="Username"
                mode="outlined"
                value={email.toLowerCase()}
                onChangeText={(text) => setEmail(text)}
                theme={{ colors: { primary: props.color.primaryColor } }}
                textColor="black"
              />

              <Button
                labelStyle={styles.labelText}
                style={[
                  styles.loginBtn,
                  // { backgroundColor: props.color.primaryColor },
                  { backgroundColor: "#D2AE6A" },
                ]}
                mode="contained"
                onPress={sendOtp}
              >
                {!loading ? "Send OTP" : "Please wait ... "}
              </Button>
              <Button
                style={styles.forgetPass}
                uppercase={false}
                mode="text"
                onPress={() => {
                  setError("");
                  props.navigation.navigate("Login");
                }}
              >
                <Text style={{ color: "#D2AE6A" }}>
                  <Text style={{ fontSize: 14 * responsive() }}>Go Back</Text>
                </Text>
              </Button>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  };

  const StepTwo = () => {
    const [Otp, setOtp] = useState("");

    const verifyOtp = async () => {
      setLoading(true);
      setError("");
      try {
        const config = {
          method: "post",
          url: `${baseURL}/staff/verifyOTP`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
            Connection: `keep-alive`,
          },
          data: { otp: Otp },
        };
        const { data } = await axios.request(config);
        if (data.status) {
          setLoading(false);
          setsteps(3);
        }
      } catch (error) {
        setLoading(false);
        setError("Invalid OTP");
      }
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
              visible={loading}
              textContent={"Loading..."}
              textStyle={styles.spinnerTextStyle}
            />
            <View style={styles.loginWrapper}>
              <Headline style={styles.heading}>Verify OTP</Headline>
              <Text style={{
                fontSize: 14 * responsive(),
                //color: props.color.primaryColor,
                color: "#D2AE6A",
              }}>(OTP Successfully Sent to your Email)</Text>
              <TextInput
                style={styles.loginInput}
                label="Enter OTP"
                mode="outlined"
                value={Otp}
                onChangeText={(o) => setOtp(o)}
                theme={{ colors: { primary: props.color.primaryColor } }}
                textColor="black"
              />

              <Button
                labelStyle={styles.labelText}
                style={[
                  styles.loginBtn,
                  // { backgroundColor: props.color.primaryColor },
                  { backgroundColor: "#D2AE6A" },
                ]}
                color={props.color.primaryColor}
                mode="contained"
                onPress={verifyOtp}
              >
                Verify OTP
              </Button>
              <Button
                style={styles.forgetPass}
                uppercase={false}
                color={props.color.primaryColor}
                mode="text"
                onPress={() => {
                  setError("");
                  setsteps(1);
                }}
              >
                <Text
                  style={{
                    fontSize: 14 * responsive(),
                    //color: props.color.primaryColor,
                    color: "#D2AE6A",
                  }}
                >
                  Go Back
                </Text>
              </Button>
              {error != "" && <Text style={{ color: "red" }}>{error}</Text>}
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  };

  const StepThree = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const updatePassword = async () => {
      try {
        setLoading(true);
        setError("");
        if (newPassword === confirmPassword) {
          const config = {
            method: "post",
            url: `${baseURL}/staff/changePassword`,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "*/*",
              Connection: `keep-alive`,
            },
            data: {
              new_password: newPassword,
              confirm_password: confirmPassword,
            },
          };
          const { data } = await axios.request(config);
          if (data.status) {
            setError("");
            setLoading(false);
            props.navigation.navigate("Login");
          }
        }
      } catch (error) {
        setLoading(false);
        setError("Server Not Responding");
      }
    };

    return (
      <View style={styles.loginWrapper}>
        <Headline style={styles.heading}>Set New Password</Headline>
        <TextInput
          style={styles.loginInput}
          label="New Password"
          mode="outlined"
          value={newPassword}
          secureTextEntry={passwordVisibility}
          // right={
          //   <TextInput.Icon
          //     onPressIn={handlePasswordVisibility}
          //     name={rightIcon}
          //   />
          // }
          onChangeText={(password) => setNewPassword(password)}
          theme={{ colors: { primary: "#D2AE6A" } }}
          textColor="black"
        />
        <TextInput
          style={styles.loginInput}
          label="Confirm Password"
          mode="outlined"
          value={confirmPassword}
          secureTextEntry={confirmVisibility}
          // right={
          //   <TextInput.Icon
          //     onPressIn={handleConfirmPasswordVisibility}
          //     name={confirmIcon}
          //   />
          // }
          onChangeText={(password) => setConfirmPassword(password)}
          theme={{ colors: { primary: "#D2AE6A" } }}
          textColor="black"
        />
        <Button
          labelStyle={styles.labelText}
          style={[styles.loginBtn, { backgroundColor: "#D2AE6A" }]}
          color={props.color.primaryColor}
          mode="contained"
          onPress={updatePassword}
        >
          {!loading ? "Update" : "please wait ..."}
        </Button>
        <Button
          style={styles.forgetPass}
          uppercase={false}
          color={props.color.primaryColor}
          mode="text"
          onPress={() => setsteps(2)}
        >
          <Text
            style={{
              fontSize: 14 * responsive(),
              color: "#D2AE6A",
            }}
          >
            Go Back
          </Text>
        </Button>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  };

  const steps = (step) => {
    switch (step) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
    }
  };

  return (
    <ScrollView style={styles.screenWrapper}>
      <StatusBar backgroundColor="white" barStyle={"dark-content"} />
      <View style={styles.imageWrapper}>
        {/* <Image
          style={styles.topImage}
          source={require("../../../assets/login.png")}
        /> */}
      </View>
      {steps(stepCount)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    height: hp("100%"),
    backgroundColor: "#fff",
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
  imageWrapper: {
    flex: 1,
    height: hp("30%"),
    width: wp("100%"),
    flexBasis: 0,
  },
  topImage: {
    width: wp("100%"),
    height: hp("30%"),
    resizeMode: "cover",
  },
  bottomLogoContainer: {
    margin: 40,
  },
  bottomLogo: {
    height: 140 * responsive(),
    width: 140 * responsive(),
  },
  loginWrapper: {
    backgroundColor: "#000000c0",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // padding: 40,
    // height: hp("70%"),
    // width: wp("100%"),
    // borderTopLeftRadius: 40,
    // borderTopRightRadius: 40,
    // marginTop: -10,
    // backgroundColor: "#fff",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 7,
    // },
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,
    // elevation: 14,
    // flexGrow: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  loginInput: {
    marginVertical: 10,
    width: wp("80%"),
    backgroundColor: "white",
    color: "black",
  },
  loginBtn: {
    marginVertical: 10,
    width: wp("80%"),
  },
  forgetPass: {
    padding: 0,
    width: wp("80%"),
  },
  labelText: {
    fontSize: 16 * responsive(),
    flex: 1,
    width: wp("80%"),
  },
});

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData,
    auth: state.Auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleTheme: (color) => dispatch(toggleTheme(color)),
    saveUserToken: (token) => dispatch(saveUserToken(token)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
