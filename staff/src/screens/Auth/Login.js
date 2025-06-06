import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import { TextInput, Headline, Button, RadioButton } from "react-native-paper";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { toggleTheme, saveUserToken, userLogin } from "../../actions";
import Background from "../../../../assets/images/background/SplashBackground.png";
import logo from "../../../../assets/logo2.png";
import Toast from "react-native-root-toast";
import { responsive } from "../../../../helper/responsive";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or any other icon set


function Home(props) {
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state) => state.Auth);
  const { pushNotificationToken } = useSelector((state) => state.feature);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rightIcon, setRightIcon] = useState("eye");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [err, setError] = useState("");
  const [state, setState] = useState("staff");

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const logInUser = () => {
    setError("");

    dispatch(
      userLogin({ email: username, password: password, pushNotificationToken })
    );
  };

  const handleNextPage = () => {
    setError("");
    props.navigation.navigate("ForgetPassword", { email: username });
  };

  useEffect(() => {
    if (error?.user) {
      setUsername(error.user.email);
      setPassword(error.user.password);
      setError("Invalid Credentials");
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      Toast.show("Logged in successfully!", {
        duration: Toast.durations.LONG,
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (err != "") {
      Toast.show(err, {
        duration: Toast.durations.LONG,
      });
    }
  }, [err]);

  const onChangeUserName = (name) => {
    setError("");
    setUsername(name);
  };

  const onPasswordChange = (pass) => {
    setError("");
    setPassword(pass);
  };
  return (
    <SafeAreaView style={styles.screenWrapper}>
      <StatusBar backgroundColor="#272727" barStyle="dark-content" />
      <ImageBackground
        source={Background}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.loginWrapper}>
          <View style={styles.bottomLogoContainer}>
            <Image source={logo} style={styles.bottomLogo} />
          </View>

          <Text style={styles.heading}>Sign Up</Text>
          <View style={styles.select}>
            <Text style={[styles.text_dis, { fontWeight: "bold" }]}>
              Login As
            </Text>
            <View style={styles.radioWrapper}>
              <RadioButton.Android
                value="first"
                status={"unchecked"}
                onPress={() => {
                  props.navigation.navigate("clientMain");
                }}
                color="#D1AE6C"
              />
              <Text style={styles.selectText}>Client</Text>
            </View>
            <View style={styles.radioWrapper}>
              <RadioButton.Android
                value="first"
                color="#D1AE6C"
                status={"checked"}
              />
              <Text style={styles.selectText}>Staff</Text>
            </View>
          </View>
          <TextInput
            style={styles.loginInput}
            placeholder="UserName"
            value={username.toLowerCase()}
            onChangeText={onChangeUserName}
            textColor="black"
            left={
              <TextInput.Icon
                icon={() => <Icon name="account" size={24} color="#D1AE6C" />}
              />
            }
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Password"
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry={passwordVisibility}
            textColor="black"
            left={
              <TextInput.Icon
                icon={() => <Icon name="lock" size={20} color="#D1AE6C" />}
              />
            }
            right={
              <TextInput.Icon
                icon={() => (
                  <Icon
                    name={rightIcon}
                    size={20}
                    color="#D1AE6C"
                    onPress={handlePasswordVisibility}
                  />
                )}
              />
            }
          />
          <Text style={styles.errorText}>{err}</Text>

          <View>
            <Button
              labelStyle={styles.labelText}
              style={[
                styles.loginBtn,
                {
                  backgroundColor: "#D1AE6C",
                  width: Platform.OS == "ios" ? "80%" : "85%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: 40,
                },
              ]}
              mode="contained"
              onPress={logInUser}
            >
              <Text>Sign In</Text>
            </Button>
          </View>

          <Button
            style={[styles.forgetPass, { color: props.color.primaryColor }]}
            uppercase={false}
            mode="text"
            onPress={handleNextPage}
          >
            <Text
              style={[
                {
                  color: "white",
                },
                {
                  fontSize: 14 * responsive(),
                },
              ]}
            >
              Forgot Password ?
            </Text>
          </Button>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    width: "100%",
  },
  screenWrapper: {
    //height: hp("100%"),
    flex: 1,
    backgroundColor: "#fff",
  },

  imageWrapper: {
    //flex: 1,
    //height: hp("30%"),
    //width: wp("100%"),
    //flexBasis: 0,
  },
  topImage: {
    //  width: wp("100%"),
    //height: hp("30%"),
    //resizeMode: "cover",
  },
  loginWrapper: {
    padding: 40,
    backgroundColor: "#000000c0",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginInput: {
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 16,
    width: "100%",
  },
  loginBtn: {
    marginVertical: 10,
    borderRadius: 5,
    width: Math.min(wp("90%"), 450),
    padding: 4 * responsive(),
    alignSelf: "center",
  },
  forgetPass: {
    padding: 0,
    width: wp("80%"),
  },
  labelText: {
    fontSize: 16 * responsive(),
    justifyContent: "center",
    width: wp("80%"),
  },

  bottomLogoContainer: {
    marginBottom: 40,
    //display: "flex",
    //justifyContent: "center",
    //alignItems: "center",
  },
  bottomLogo: {
    height: 140 * responsive(),
    width: 140 * responsive(),
  },

  image: {
    // flex: 1,
    width: "100%",
    height: "100%",
    //justifyContent: "center",
    // marginTop: -50,
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
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 20,
    marginBottom: 20,
    //width: "100%",
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
