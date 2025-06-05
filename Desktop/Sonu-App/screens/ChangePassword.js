import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  TextInput,
  Image,
  ImageBackground,
  PixelRatio,
  Dimensions,
} from "react-native";
// pachakes import
import Icon from "react-native-vector-icons/Feather";
import Background from "../assets/images/background/background-2.jpg";
// constants
import configResponse from "../config/constant";
// services imports
import UpdatePasswordRequest from "../service/User";
import { responsive } from "../helper/responsive";

function ChangePassword() {
  const [old_password, onChangeOldPassword] = React.useState(null);
  const [new_password, onChangePassword] = React.useState(null);
  const [confirm_password, onChangeConfirmPassword] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const ChangePasswordRequest = () => {
    if (!old_password) {
      configResponse.errorMSG("Please enter old password");
      return;
    }
    if (!new_password) {
      configResponse.errorMSG("Please enter new password");
      return;
    }
    if (!confirm_password) {
      configResponse.errorMSG("Please enter confirm password");
      return;
    }
    if (new_password != confirm_password) {
      configResponse.errorMSG("Password and confirm password mismatch");
      return;
    }
    const data = { old_password, new_password, confirm_password };
    setIsLoading(true);
    UpdatePasswordRequest(data)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          onChangeOldPassword(null);
          onChangePassword(null);
          onChangeConfirmPassword(null);
          configResponse.successMSG(response.data.message);
        } else {
          configResponse.errorMSG(response.data.errors);
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
        <ScrollView contentContainerStyle={styles.scrollStyle}>
          <View style={styles.MasterView}>
            <View style={styles.serviceCol}>
              <Image
                resizeMode="contain"
                style={styles.pic}
                source={require("../assets/images/logo.png")}
              />
              <View style={styles.from}>
                <View style={styles.from_group}>
                  <Icon
                    style={styles.icons}
                    size={16}
                    color="#70757a"
                    name="lock"
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#70757a"
                    placeholder="Old Password"
                    secureTextEntry={true}
                    onChangeText={onChangeOldPassword}
                    value={old_password}
                  />
                </View>

                <View style={styles.from_group}>
                  <Icon
                    style={styles.icons}
                    size={16}
                    color="#70757a"
                    name="lock"
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#70757a"
                    placeholder="New Password"
                    secureTextEntry={true}
                    onChangeText={onChangePassword}
                    value={new_password}
                  />
                </View>

                <View style={styles.from_group}>
                  <Icon
                    style={styles.icons}
                    size={16}
                    color="#70757a"
                    name="lock"
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#70757a"
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={onChangeConfirmPassword}
                    value={confirm_password}
                  />
                </View>
              </View>
              <Pressable
                style={styles.button}
                onPressIn={ChangePasswordRequest}
              >
                <Text style={styles.buttonText}>Change Password</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ChangePassword;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  image: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    position: "relative",
    top: -50,
  },
  MasterView: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    paddingTop: 60,
  },
  serviceCol: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 470,
  },
  scrollStyle: {
    height: "auto",
  },
  from: {
    marginVertical: 10,
  },
  from_group: {
    position: "relative",
    marginBottom: 20,
    borderBottomWidth: 0.2,
    borderColor: "#70757a",
  },
  input: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#70757a",
    width: "100%",
    paddingLeft: 30,
    paddingBottom: 5,
  },
  icons: {
    position: "absolute",
    left: 5,
    top: 6,
  },
  button: {
    backgroundColor: configResponse.primaryBackground,
    width: 180,
    marginLeft: "auto",
    marginRight: "auto",
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#ffffff",
    marginTop: 1,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
  pic: {
    height: 120,
    width: 120,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
  },
});
