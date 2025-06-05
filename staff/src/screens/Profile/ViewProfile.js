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
  ToastAndroid,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { FontAwesome5 } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import Spinner from "react-native-loading-spinner-overlay";
import * as FileSystem from "expo-file-system";
import { connect, useDispatch, useSelector } from "react-redux";
import { baseURL } from "../../constants";
import axios from "axios";
import { RadioButton } from "react-native-paper";
import { LoadUser, setUser } from "../../actions";
import Toast from "react-native-root-toast";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsive } from "../../../../helper/responsive";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "../../../../components/button";
import { isTablet } from "../../../../components/tablet";
async function UpdateProfile(data, token) {
  try {
    return await axios.post(`${baseURL}/staff/updateProfile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } catch (error) {
    return error?.response;
  }
}

async function UpdateProfileData(userToken, data) {
  try {
    return await axios.post(`${baseURL}/staff/update`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    });
  } catch (error) {
    return error.response;
  }
}

function Profile(props) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.Auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [first_name, onChangeFirstName] = React.useState(null);
  const [email, onChangeEmail] = React.useState(null);
  const [gender, setGender] = React.useState("Male");
  const [phone, onChangePhone] = React.useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      // uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', '')
      const profile = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: "base64",
      });
      UpdateProfile(profile, token)
        .then((response) => {
          if (response?.status == 200) {
            dispatch(setUser(response.data.data));
            // ToastAndroid.show("Profile Picture Updated Successfully", ToastAndroid.SHORT)
            Toast.show("Profile Picture Updated Successfully", {
              duration: Toast.durations.LONG,
            });
          }
        })
        .catch((error) => { });
    }
  };
  // return
  // dispatch(LoadUser(token))

  const UpdateMyProfile = () => {
    if (!first_name) {
      console.log("Please enter first name");
      return;
    }

    if (!email) {
      console.log("Please enter email id.");
      return;
    }

    if (!gender) {
      console.log("Please select your gender");
      return;
    }

    if (!phone) {
      console.log(`Enter phone number`);
      return;
    }

    const data = {
      name: first_name,
      email: email,
      phone: phone,
      gender: gender,
    };
    setIsLoading(true);
    UpdateProfileData(token, data)
      .then(async (response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          dispatch(setUser(response.data.data));
          // ToastAndroid.show("Profile Updated Successfully", ToastAndroid.SHORT)
          Toast.show("Profile Updated Successfully", {
            duration: Toast.durations.LONG,
          });
        } else {
          console.log("Please fill all required fields.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (user) {
      onChangeEmail(user.email);
      onChangePhone(user.phone);
      onChangeFirstName(user.name);
      setGender(user.gender);
    }
  }, [user]);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView
          contentContainerStyle={styles.scrollStyle}
        >
          <Spinner
            visible={isLoading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
          />
          <View style={styles.profileWrapper}>
            <View
              style={styles.headWrapper}
            >
              <View
                style={styles.titleWrapper}
              >
                <Pressable
                  onPress={() => props.navigation.goBack()}
                  style={{ position: "absolute", left: 10 }}
                >
                  <Ionicons
                    name="arrow-back"
                    size={isTablet() ? 24 : 20}
                    color="black"
                  />
                </Pressable>
                <Text style={styles.profileTitle}>Edit Profile</Text>
              </View>
              <View style={[styles.headerBackground,]}>
                <Pressable onPressIn={pickImage}>
                  <View style={styles.picoutline}>
                    <Image
                      resizeMode="cover"
                      style={styles.pic}
                      source={image ? image : { uri: user?.staff_profile }}
                    />
                  </View>
                </Pressable>
                <Pressable onPressIn={pickImage} style={styles.editIcon}>
                  <FontAwesome5 name="user-edit" style={styles.camera} />
                </Pressable>
              </View>
            </View>
            <View style={[styles.MasterView, { marginTop: 20 }]}>
              <View style={styles.serviceCol}>
                <View style={styles.from}>
                  <View style={styles.from_group}>
                    <Icon
                      style={styles.icons}
                      size={16 * responsive()}
                      color={"black"}
                      name="user"
                    />
                    <TextInput
                      style={styles.input}
                      placeholderTextColor="#70757a"
                      placeholder="First Name"
                      value={first_name}
                      onChangeText={onChangeFirstName}
                      keyboardType="visible-password"
                    />
                  </View>
                  <View style={styles.from_group}>
                    <Icon
                      style={styles.icons}
                      size={16 * responsive()}
                      color={"black"}
                      name="at-sign"
                    />
                    <TextInput
                      style={styles.input}
                      placeholderTextColor="#70757a"
                      placeholder="Email Id"
                      value={email}
                      onChangeText={onChangeEmail}
                    />
                  </View>
                  <View style={styles.from_group}>
                    <Icon
                      style={styles.icons}
                      size={16 * responsive()}
                      // color="#70757a"
                      color={"black"}
                      name="phone"
                    />
                    <TextInput
                      style={styles.input}
                      placeholderTextColor="#70757a"
                      placeholder="Contact No."
                      value={phone}
                      onChangeText={onChangePhone}
                    />
                  </View>
                  <View style={[styles.inputWrapper, styles.gender]}>
                    <Text style={{ fontSize: 14 * responsive(),}}>Gender :</Text>
                    <View style={styles.gender}>
                      <View style={styles.gender}>
                        <RadioButton.Android
                          value={gender}
                          status={gender === "Male" ? "checked" : "unchecked"}
                          onPress={() => setGender("Male")}
                          color={props.color.primaryColor}
                        />
                        <Text
                          style={{
                            fontSize: 14 * responsive(),
                          }}
                        >
                          Male
                        </Text>
                      </View>
                      <View style={styles.gender}>
                        <RadioButton.Android
                          value={gender}
                          status={gender === "Female" ? "checked" : "unchecked"}
                          onPress={() => setGender("Female")}
                          color={props.color.primaryColor}
                        />
                        <Text
                          style={{
                            fontSize: 14 * responsive(),
                          }}
                        >Female</Text>
                      </View>
                    </View>
                  </View>
                  <Button title={"Save"} onPress={UpdateMyProfile} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  profileWrapper: {
    flex: 1,
  },
  headWrapper: {
   backgroundColor: "#D2AE6A",
   borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1AE6C",
    paddingHorizontal: 20,
    paddingTop: 2,
    justifyContent: "center",
    margin: 20,
  },
  profileTitle: {
    marginLeft: 20,
    fontSize: isTablet() ? 24 : 18,
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  camera: {
    position: "absolute",
    top: -40,
    right: -60,
    fontSize: 20 * responsive(),
    color: "#FFD700",
    borderRadius: 15,
    padding: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  editIcon: {
    position: "relative",
  },
  inputWrapper: {
    //flex: 3,
  },
  gender: {
    //display: "flex",
    flexDirection: "row",
    //justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    //padding: 10,
  },
  MasterView: {
    //flex: 1,
    //maxWidth: 800,
    //alignSelf: "center",
    //display: "flex",
    //flexDirection: "column",
    //flexWrap: "wrap",
    // paddingVertical: 20,
    // paddingHorizontal: 20,
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  serviceCol: {
    //minWidth: wp("80%"),
    //flex: 1,
    //padding: 30,
  },
  scrollStyle: {
    // height: "auto",
    flex: 1,
  },
  pic: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  picoutline: {
    height: 130,
    width: 130,
    backgroundColor: "#ffffff",
    borderRadius: 110,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginLeft: "auto",
    marginRight: "auto",
    overflow: "hidden",
    position: "relative",
  },
  userName: {
    fontSize: 16 * responsive(),
    color: "black",
    marginTop: 15,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
  },
  from: {
    marginVertical: 10,
  },
  from_group: {
    // position: "relative",
    marginBottom: 15,
    borderBottomWidth: 1,
    // borderColor: "#70757a",
    borderColor: "black",
    // paddingBottom: 10,
  },
  input: {
    fontSize: 16 * responsive(),
    color: "black",
    width: "100%",
    paddingLeft: 35,
    paddingBottom: 5,
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
    color: "#70757a",
    paddingLeft: 5,
    paddingBottom: 5,
  },
  button: {
    //backgroundColor: "#FFD700",
    backgroundColor: "#D2AE6A",
    //width: 150,
    width: "40%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: -20,
    // marginBottom:20

    // marginVertical: 10,
  },
  buttonText: {
    fontSize: 16 * responsive(),
    marginTop: 1,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
  headerBackground: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
