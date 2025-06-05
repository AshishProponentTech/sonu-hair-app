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
  StatusBar,
  PixelRatio,
  Touchable,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/Feather";

import { Entypo } from "react-native-vector-icons";
import { AuthContext } from "../helper/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
import {
  ShowProfile,
  UpdateProfileData,
  UpdateProfile,
} from "../service/MyProfile";
import Spinner from "react-native-loading-spinner-overlay";
// constants
import configResponse, { infoMSG } from "../config/constant";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Dimensions } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { responsive } from "../helper/responsive";
import Iconions from "react-native-vector-icons/Ionicons";
import { isTablet } from "../components/tablet";

const data = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

function Profile({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const { signOut } = React.useContext(AuthContext);
  const [first_name, onChangeFirstName] = React.useState(null);
  const [last_name, onChangeLastName] = React.useState(null);
  const [email, onChangeEmail] = React.useState(null);
  const [gender, onChangegender] = React.useState("male");
  const [phone, onChangePhone] = React.useState("");
  const nav = useNavigation();
  const openDrawer = () => {
    nav.dispatch(DrawerActions.openDrawer());
  };

  function myProfileLoad() {
    setIsLoading(true);
    ShowProfile()
      .then(async (response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data;
          const pic = { uri: output["pic"] };
          onChangeFirstName(output["first_name"]);
          onChangeLastName(output["last_name"]);
          onChangegender(output["gender"]);
          onChangeEmail(output["email"]);
          onChangePhone(output["phone"]);
          setImage(pic);
        } else {
          signOut();
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }
  React.useEffect(() => {
    myProfileLoad();
  }, []);

  const checkFileSize = async (fileURI) => {
    const fileSizeInBytes = await FileSystem.getInfoAsync(fileURI);
    return fileSizeInBytes;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log("data", result);
    if (!result.canceled) {
      const fileSize = await checkFileSize(result.assets[0].uri);
      if (fileSize.size > 5 * 1024 * 1024) {
        const sizeInMB = Math.floor(fileSize.size / 1024 / 1024);
        infoMSG(
          `Image size is too large ${sizeInMB}+. Recommande to change it for better experience else you can ignore the message`,
          6000
        );
      }
      uri: Platform.OS === "android"
        ? result.assets[0].uri
        : result.assets[0].uri.replace("file://", "");
      const profile = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: "base64",
      });

      UpdateProfile(profile)
        .then((response) => {
          if (response?.status == 200) {
            myProfileLoad();
            configResponse.successMSG("Profile Updated !");
          } else if (response?.status == 404) {
            configResponse.errorMSG("Image not found");
          } else {
            configResponse.errorMSG(
              "Unexpected error occurred while uploading profile"
            );
          }
        })
        .catch((error) => {
          configResponse.errorMSG(error.message);
        });
    }
  };

  const UpdateMyProfile = () => {
    if (!first_name) {
      configResponse.errorMSG("Please enter first name");
      return;
    }
    if (!last_name) {
      configResponse.errorMSG("Please enter last name");
      return;
    }
    if (!email) {
      configResponse.errorMSG("Please enter email id.");
      return;
    }
    if (!gender) {
      configResponse.errorMSG("Please select your gender");
      return;
    }
    if (!phone) {
      return configResponse.errorMSG(`Enter phone number`);
    }
    const data = { first_name, last_name, email, gender, phone };
    setIsLoading(true);
    UpdateProfileData(data)
      .then(async (response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          configResponse.successMSG("Profile Updated !");
          await SecureStore.setItemAsync("userPhone", phone);
          const goNextValue = route?.params?.data;
          if (goNextValue?.phone) {
            navigation.navigate("Booking", { goNextValue });
          }
        } else {
          configResponse.errorMSG("Please fill all required fields.");
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View contentContainerStyle={styles.scrollStyle}>
          <Spinner
            visible={isLoading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#D1AE6C",
              paddingHorizontal: 25,
              paddingTop: 25,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Iconions
                name="arrow-back"
                size={isTablet() ? 24 : 20}
                color={"black"}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: isTablet() ? 24 : 18,
                fontWeight: "600",
                textAlign: "center",
                position: "absolute",
                left: "60%",
                transform: [{ translateX: -50 }],
                top: 23,
              }}
            >
              Edit Profile
            </Text>
          </View>
          <View style={styles.headerBacground}>
            <View style={styles.picoutline}>
              <Image resizeMode="cover" style={styles.pic} source={image} />
              <Pressable onPressIn={pickImage} style={styles.cameraIcon}>
                <Entypo name="camera" color="white" size={20} />
              </Pressable>
            </View>
          </View>
          <View style={styles.MasterView}>
            <View style={styles.serviceCol}>
              <View style={styles.from}>
                <View style={styles.from_group}>
                  <Icon
                    style={styles.icons}
                    size={16}
                    color="black"
                    name="user"
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="black"
                    placeholder="First Name"
                    value={first_name}
                    onChangeText={onChangeFirstName}
                  />
                </View>
                <View style={styles.from_group}>
                  <Icon
                    style={styles.icons}
                    size={16}
                    color="black"
                    name="user"
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="black"
                    placeholder="Last Name"
                    value={last_name}
                    onChangeText={onChangeLastName}
                  />
                </View>
                <View style={styles.from_group}>
                  <Icon
                    style={styles.icons}
                    size={16}
                    color="black"
                    name="at-sign"
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="black"
                    placeholder="Email Id"
                    value={email?.toLowerCase()}
                    onChangeText={onChangeEmail}
                  />
                </View>
                <View style={styles.from_group}>
                  <Icon
                    style={styles.icons}
                    size={16}
                    color="black"
                    name="phone"
                  />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="black"
                    placeholder="Contact No."
                    value={phone}
                    keyboardType="numeric"
                    onChangeText={onChangePhone}
                  />
                </View>
                <View style={styles.from_group}>
                  <Dropdown
                    style={[styles.input]}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    // maxHeight={110}
                    labelField="label"
                    valueField="value"
                    value={gender}
                    onChange={(item) => {
                      onChangegender(item.value);
                    }}
                    renderLeftIcon={() => (
                      <Icon
                        style={styles.icon}
                        color="black"
                        name="user-plus"
                        size={16}
                      />
                    )}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.saveButtonView}
                onPress={UpdateMyProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#ffffff",
  },
  topNav: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: "#FFD700",

    paddingBottom: 10,
  },
  cameraIcon: {
    position: "absolute",
    bottom: -8,
    right: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  MasterView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 150,
    paddingTop: 10,
    marginTop: 40,
  },
  serviceCol: {
    width: "100%",
    padding: 10,
  },
  scrollStyle: {
    height: "auto",
  },
  pageHeading: {
    fontSize: 18 * responsive(),
    fontWeight: "bold",
    marginLeft: 20,
  },
  pic: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  picoutline: {
    height: 110,
    width: 110,
    backgroundColor: "#ffffff",
    borderRadius: 110,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    position: "absolute",
    bottom: 0,
    marginBottom: -30,
    right: "50%",
    left: "50%",
    marginRight: -55,
    marginLeft: -55,
  },
  userName: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "black",
    marginTop: 15,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
  },
  from: {
    marginVertical: 10,
    minWidth: Math.min(heightPercentageToDP("90%", 500)),
    maxWidth: widthPercentageToDP("70%"),
    display: "flex",
    alignSelf: "center",
    overflow: "hidden",
  },
  from_group: {
    position: "relative",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderColor: "black",
  },
  input: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "black",
    maxWidth: widthPercentageToDP("70%"),
    paddingLeft: 35,
    paddingBottom: 5,
    overflow: "hidden",
  },
  icons: {
    position: "absolute",
    left: 5,
    top: 6,
  },
  icon: {
    position: "absolute",
    left: -25,
    top: 6,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  selectedTextStyle: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "black",
    paddingLeft: 5,
    paddingBottom: 5,
  },
  button: {
    backgroundColor: "#FFD700",
    width: 150,
    marginLeft: "auto",
    marginRight: "auto",
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "black",
    marginTop: 1,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
  headerBacground: {
    backgroundColor: "#D2AE6A",
    height: "22%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  saveButtonView: {
    backgroundColor: "#D2AE6A",
    width: "auto",
    alignSelf: "center",
    marginTop: 10,
    paddingVertical: isTablet() ? 15 : 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  saveButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: isTablet() ? 20 : 16,
    fontWeight: "700",
  },
});
