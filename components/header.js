import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Linking,
  Share,
  StatusBar,
  TouchableOpacity,
  Text,
} from "react-native";
import { Avatar, Drawer } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from "../helper/AuthContext";
import configResponse from "../config/constant";
import { ShowProfile } from "../service/MyProfile";
import { useIsFocused } from "@react-navigation/native";
import { AppStateContext } from "../helper/AppStateContaxt";
import guestUser from "../assets/guestUser.png";
import { responsive } from "../helper/responsive";
import Ionicons from "react-native-vector-icons/Ionicons";
import { isTablet } from "./tablet";

function HeaderDrawerMenu(props) {
  const isFocus = useIsFocused();
  const { guestMode } = useContext(AppStateContext);
  const { signOut } = useContext(AuthContext);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  global.GOOGLE_PACKAGE_NAME = "com.sonuhaircut";
  global.APPLE_STORE_ID = "id284882215";
  const HomeIcon = ({ size }) => (
    <Icon name="home" color="white" size={size} />
  );

  const AppointmentIcon = ({ size }) => (
    <Icon name="check-circle" color="white" size={size} />
  );

  const AboutIcon = ({ size }) => (
    <Icon name="alert-circle" color="white" size={size} />
  );

  const ContactIcon = ({ size }) => (
    <Icon name="message-circle" color="white" size={size} />
  );

  const ProfileIcon = ({ size }) => (
    <Icon name="user" color="white" size={size} />
  );

  const ShareIcon = ({ size }) => (
    <Icon name="share-2" color="white" size={size} />
  );

  const RateIcon = ({ size }) => (
    <Icon name="star" color="white" size={size} />
  );

  const CloseAccountIcon = ({ size }) => (
    <Icon name="user-x" color="white" size={size} />
  );
  const drawerLabelStyle = {
  fontSize: 14 * responsive(),
  color: "white",
};
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
          dialogTitle: "Share SonuhairCut App",
        }
      );
      if (result.action === Share.sharedAction) {
        return;
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
          setUserProfile(pic);
          setUserEmail(output["email"]);
          setUserName(`${output["first_name"]} ${output["last_name"]}`);
        } else {
          signOut();
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };

  useEffect(() => {
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
                    source={{ uri: userProfile }}
                    size={80}
                    resizeMode="cover"
                    style={styles.avatar}
                  />
                  <View
                    style={{
                      marginLeft: 10,
                      width: "64%"
                    }}
                  >
                    <Text style={[styles.title, { marginLeft: 10, marginBottom: 2, width: "95%" }]}>
                      {userName}
                    </Text>
                    {/* <Text style={[styles.text]} numberOfLines={1} ellipsizeMode="tail">{userEmail}</Text> */}
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
                    justifyContent: "center",
                    width: "100%",
                    marginLeft: 10,
                  }}
                >
                  <Text style={styles.title}>Guest User</Text>
                </View>
              </View>
            )}
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              labelStyle={drawerLabelStyle}
              icon={HomeIcon}
              label="Home"
              onPress={() =>
                props.navigation.navigate("ServiceStack", { screen: "Dashboard" })
              }
            />
            {!guestMode && (
              <DrawerItem
                labelStyle={drawerLabelStyle}
                icon={AppointmentIcon}
                label="My Appointment"
                onPress={() => props.navigation.navigate("UpcomingBooking")}
              />
            )}

            <DrawerItem
              labelStyle={drawerLabelStyle}
              icon={AboutIcon}
              label="About Us"
              onPress={() => props.navigation.navigate("AboutUs")}
            />

            <DrawerItem
              labelStyle={drawerLabelStyle}
              icon={ContactIcon}
              label="Contact Us"
              onPress={() => props.navigation.navigate("Contact")}
            />

            {!guestMode && (
              <DrawerItem
                labelStyle={drawerLabelStyle}
                icon={ProfileIcon}
                label="My Profile"
                onPress={() => props.navigation.navigate("Profile")}
              />
            )}

            <DrawerItem
              labelStyle={drawerLabelStyle}
              icon={ShareIcon}
              label="Share"
              onPress={ShareApp}
            />

            <DrawerItem
              labelStyle={drawerLabelStyle}
              icon={RateIcon}
              label="Rate Us"
              onPress={openStore}
            />

            {!guestMode && (
              <DrawerItem
                labelStyle={drawerLabelStyle}
                icon={CloseAccountIcon}
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
HeaderDrawerMenu.propTypes = {
  navigation: PropTypes.shape({
    closeDrawer: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
export default HeaderDrawerMenu;
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingBottom: 15,
    backgroundColor: "#171717",
  },
  title: {
    fontSize: 17 * responsive(),
    marginTop: 3,
    fontWeight: "bold",
    fontFamily: configResponse.fontFamily,
    textAlign: "text",
    color: "white",
  },
  text: {
    fontSize: 14 * responsive(),
    lineHeight: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    textAlign: "center",
    color: "white"
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
