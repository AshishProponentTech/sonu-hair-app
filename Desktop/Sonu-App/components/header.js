import * as React from "react";
import {
  View,
  StyleSheet,
  Platform,
  Linking,
  Share,
  StatusBar,
  PixelRatio,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Text,
} from "react-native";
import { Avatar, Title, Drawer } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from "../helper/AuthContext";
import configResponse from "../config/constant";
import { ShowProfile } from "../service/MyProfile";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AppStateContext } from "../helper/AppStateContaxt";
import guestUser from "../assets/guestUser.png";
import { responsive } from "../helper/responsive";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { isTablet } from "./tablet";

function HeaderDrawerMenu(props) {
  const isFocus = useIsFocused();
  const { setGuestMode, guestMode } = React.useContext(AppStateContext);

  const { signOut } = React.useContext(AuthContext);
  const [UserName, setName] = React.useState(null);
  const [UserEmail, setEmail] = React.useState(null);
  const [UserPic, setProfile] = React.useState(null);

  global.GOOGLE_PACKAGE_NAME = "com.sonuhaircut";
  global.APPLE_STORE_ID = "id284882215";

  const openStore = () => {
    if (Platform.OS != "ios") {
      Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(
        (err) => alert("Please check for the Google Play Store")
      );
    } else {
      Linking.openURL(
        `itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`
      ).catch((err) => alert("Please check for the App Store"));
    }
  };

  const ShareApp = async () => {
    let text =
      "Want more styles to try for your hair ? Let's make your lifestyle get more eyeballs..Download Sonuhaircut App ";
    let url = "https://play.google.com/store/apps/details?id=com.sonuhaircut";
    if (Platform.OS === "android") {
      text = text.concat(
        "https://play.google.com/store/apps/details?id=com.sonuhaircut"
      );
    } else {
      text = text.concat(
        "https://apps.apple.com/ca/app/sonu-hair-cut/id1505076368"
      );
      url = "https://apps.apple.com/ca/app/sonu-hair-cut/id1505076368";
    }
    try {
      const result = await Share.share(
        {
          message: text,
          subject: "Download Sonuhaircut App Now",
          url: url,
          title: "Sonu Hair Cut , Style for lifestyle",
        },
        {
          // Android only:
          dialogTitle: "Share SonuhairCut App",
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getProfile = () => {
    ShowProfile()
      .then(async (response) => {
        if (response?.status == 200) {
          const output = response?.data;
          const pic = output["pic"];
          setProfile(pic);
          setEmail(output["email"]);
          setName(`${output["first_name"]} ${output["last_name"]}`);
        } else {
          signOut();
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };

  React.useEffect(() => {
    getProfile();
  }, [props, isFocus]);

  return (
    <View style={{ flex: 1, backgroundColor: "#171717" }}>
      <StatusBar backgroundColor="#D2AE6A" barStyle="dark-content" />
      <DrawerContentScrollView {...props} style={{}}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            {!guestMode && (
              <View>
                <TouchableOpacity
                  onPress={() => props.navigation.closeDrawer()}
                >
                  <Ionicons
                    name="chevron-back"
                    size={30}
                    color={"white"}
                    style={{ marginTop: 10 }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    // flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 15,
                    borderBottomWidth: 1,
                    borderColor: "#FFFFFF",
                    paddingBottom: 25,
                  }}
                >
                  <Avatar.Image
                    source={{ uri: UserPic }}
                    size={80}
                    resizeMode="cover"
                    style={styles.avatar}
                  />
                  <View
                    style={{
                      //   flexDirection: "column",
                      //width: "100%",
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={[styles.title, { marginLeft: 10, width: "90%" }]}
                    >
                      {UserName}
                    </Text>

                    {/* <Caption style={styles.caption}>{UserEmail}</Caption> */}
                  </View>
                </View>
              </View>
            )}
            {guestMode && (
              <View
                style={{
                  // flexWrap: "wrap",
                  flexDirection: "row",
                  marginTop: 15,
                }}
              >
                <Avatar.Image
                  source={guestUser}
                  size={80}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View
                  style={{
                    //marginLeft: 15,
                    // flexDirection: "column",
                    justifyContent: "center",
                    width: "100%",
                    marginLeft: 10,
                  }}
                >
                  <Title style={styles.title}>Guest User</Title>
                  {/* <Caption style={styles.caption}>{UserEmail}</Caption> */}
                </View>
              </View>
            )}
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
                color: "white",
              }}
              icon={({ color, size }) => (
                <Icon name="home" color={"white"} size={size} />
              )}
              label="Home"
              onPress={() =>
                props.navigation.navigate("ServiceStack", {
                  screen: "Dashboard",
                })
              }
            />
            {/* <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="users"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Services"
                            onPress={() => {
                                props.navigation.navigate("Home", { screen: "ServiceStack" });
                            }}
                        /> */}
            {!guestMode && (
              <DrawerItem
                labelStyle={{
                  fontSize: 14 * responsive(),
                  color: "white",
                }}
                icon={({ color, size }) => (
                  <Icon name="check-circle" color={"white"} size={size} />
                )}
                label="My Appointment"
                onPress={() => props.navigation.navigate("UpcomingBooking")}
              />
            )}

            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
                color: "white",
              }}
              icon={({ color, size }) => (
                <Icon name="alert-circle" color={"white"} size={size} />
              )}
              label="About Us"
              onPress={() => props.navigation.navigate("AboutUs")}
            />

            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
                color: "white",
              }}
              icon={({ color, size }) => (
                <Icon name="message-circle" color={"white"} size={size} />
              )}
              label="Contact Us"
              onPress={() => props.navigation.navigate("Contact")}
            />

            {!guestMode && (
              <DrawerItem
                labelStyle={{
                  fontSize: 14 * responsive(),
                  color: "white",
                }}
                icon={({ color, size }) => (
                  <Icon name="user" color={"white"} size={size} />
                )}
                label="My Profile"
                onPress={() => props.navigation.navigate("Profile")}
              />
            )}

            {/* <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="settings"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {
                                props.navigation.navigate("SettingsScreen");
                            }}
                        />   */}
            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
                color: "white",
              }}
              icon={({ color, size }) => (
                <Icon name="share-2" color={"white"} size={size} />
              )}
              label="Share"
              onPress={ShareApp}
            />
            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
                color: "white",
              }}
              icon={({ color, size }) => (
                <Icon name="star" color={"white"} size={size} />
              )}
              label="Rate Us"
              onPress={openStore}
            />

            {!guestMode && (
              <DrawerItem
                labelStyle={{
                  fontSize: 14 * responsive(),
                  color: "white",
                }}
                icon={({ color, size }) => (
                  <Icon name="user-x" color={"white"} size={size} />
                )}
                label="Close Account"
                onPress={() => props.navigation.navigate("Feedback")}
              />
            )}
          </Drawer.Section>

          {!guestMode && (
            <TouchableOpacity onPress={signOut} style={styles.logOutView}>
              <Text style={styles.logOutText}>Log out</Text>
            </TouchableOpacity>
          )}

          {guestMode && (
            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
              }}
              icon={({ color, size }) => (
                <Icon name="user-plus" color={color} size={size} />
              )}
              label="Sign Up"
              onPress={() => props.navigation.navigate("SignUp")}
            />
          )}
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default HeaderDrawerMenu;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    //marginTop: -5,
  },
  userInfoSection: {
    paddingLeft: 20,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingBottom: 15,
    // backgroundColor: "#FFD700",
    backgroundColor: "#171717",
  },
  title: {
    fontSize: 16 * responsive(),
    marginTop: 3,
    fontWeight: "bold",
    fontFamily: configResponse.fontFamily,
    textAlign: "text",
    color: "white",
  },
  caption: {
    fontSize: 14 * responsive(),
    lineHeight: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    textAlign: "center",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 0,
  },
  bottomDrawerSection: {
    marginBottom: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    backgroundColor: "transparent",
    //borderWidth: 1,
  },
  logOutView: {
    backgroundColor: "#D2AE6A",
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 25,
  },
  logOutText: {
    textAlign: "center",
    color: "white",
    fontSize: isTablet() ? 18 : 16,
    fontWeight: "600",
  },
});
