import * as React from "react";
import { Text, StyleSheet, Pressable, Image, PixelRatio } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
// import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
// import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
// constants
import configResponse from "../config/constant";
// images
import FacebookImage from "../assets/images/facebook.png";
import GoogleImage from "../assets/images/google.png";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import splash from "../assets/splash.png";
import { responsive } from "../helper/responsive";
WebBrowser.maybeCompleteAuthSession();
function SocialLogin({ navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "674763129746-n08d7ia436n9vm11ui8tb3664psrn0ak.apps.googleusercontent.com",
    androidClientId:
      "674763129746-hhvii5nujbtm5q3ds6bhe6mijjj75ckk.apps.googleusercontent.com",
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "619795593242633",
  });

  const loginWithGoogle = async (data) => {
    try {
      const backendData = {
        email: data.email,
        first_name: data.given_name,
        last_name: data.family_name,
        social_id: data.id,
        social_type: "gmail",
        pic: data.picture,
        country_code: "CA",
        dial_code: "+1",
      };

      const res = await axios.post(
        `${configResponse.baseURL}/auth/social_login`,
        backendData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (error) {}
  };

  const loginWithFacebook = async (data) => {
    try {
      const backendData = {
        email: data.email,
        first_name: data.given_name,
        last_name: data.family_name,
        social_id: data.id,
        social_type: "gmail",
        pic: data.picture,
        country_code: "CA",
        dial_code: "+1",
      };

      const res = await axios.post(
        `${configResponse.baseURL}/auth/social_login`,
        backendData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (error) {}
  };

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      axios
        .get("https://www.googleapis.com/userinfo/v2/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((response) => {
          loginWithGoogle(response.data);
        })
        .catch((error) => {});
    }
  }, [response]);

  React.useEffect(() => {
    if (fbResponse?.type === "success") {
      const { access_token } = fbResponse.params;
      axios
        .get(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`,
          {}
        )
        .then((response) => {
          loginWithFacebook(response.data);
        })
        .catch((error) => {});
    } else {
    }
  }, [fbResponse]);

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

  return (
    <>
      <Text style={[styles.text_dis, styles.margin20, { fontWeight: "bold" }]}>
        Login With social network
      </Text>
      <Pressable
        disabled={!request}
        onPressIn={async () => {
          const responseRcv = await promptAsync();
        }}
        style={styles.socialButton}
      >
        <Image
          source={GoogleImage}
          style={{ width: 20 }}
          resizeMode="contain"
        />
        <Text style={[styles.iconButton, styles.text_black]}>
          {" "}
          Sign in with google
        </Text>
      </Pressable>

      <Pressable
        onPressIn={async () => {
          const responseRcv = await fbPromptAsync();
        }}
        style={[styles.socialButton, styles.bg_blue]}
      >
        <Image
          source={FacebookImage}
          style={{ width: 20 }}
          resizeMode="contain"
        />
        <Text style={styles.iconButton}>Sign in with facebook</Text>
      </Pressable>
    </>
  );
}

export default SocialLogin;

const styles = StyleSheet.create({
  socialButton: {
    borderRadius: 4,
    backgroundColor: "#ffffff",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width: 250,
    height: 40,
    marginTop: 20,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "center",
  },
  iconButton: {
    textAlign: "center",
    flex: 1,
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
    // fontFamily: 'Inter_400Regular',
    fontWeight: "bold",
    fontSize: 14 * responsive(),
  },
  bg_blue: {
    backgroundColor: "#0674e7",
  },
  text_black: {
    color: "#000000",
  },
  text_dis: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16 * responsive(),
    fontFamily: "Inter_400Regular",
    marginTop: 20,
  },
  margin20: {},
});
