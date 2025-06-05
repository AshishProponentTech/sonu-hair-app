import React from "react";
import {
  View,
  StyleSheet,
  ToastAndroid,
  Dimensions,
  Touchable,
  Text,
} from "react-native";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { Avatar, Title, Caption, Paragraph, Drawer } from "react-native-paper";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { removeUserToken } from "../actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { responsive } from "../../../helper/responsive";
import Button from "../../../components/button";
import { TouchableOpacity } from "react-native-gesture-handler";
import { isTablet } from "../../../components/tablet";

export default function DrawerContent(props) {
  const { user, token } = useSelector((state) => state.Auth);
  const { appointmentCount } = useSelector((state) => state.AppointmentReducer);

  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(removeUserToken(token));
    Toast.show("Logged Out", {
      duration: Toast.durations.LONG,
    });
  };

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "black" }}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              paddingBottom: 20,
            }}
          >
            <Avatar.Image
              source={{
                uri: user.staff_profile,
              }}
              size={100}
              style={{ marginTop: 20 }}
            />
            <Title style={styles.title} numberOfLines={2}>
              {user.name}{" "}
            </Title>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            labelStyle={{
              fontSize: 14 * responsive(),
              color: "white",
            }}
            icon={({ color, size }) => (
              <AntDesign name="home" color={"white"} size={size} />
            )}
            label="Home"
            onPress={() =>
              props.navigation.navigate("Article", { screen: "Home" })
            }
          />
          <DrawerItem
            labelStyle={{
              fontSize: 14 * responsive(),
              color: "white",
            }}
            icon={({ color, size }) => (
              <AntDesign name="team" color={"white"} size={size} />
            )}
            label="View Appointments"
            onPress={() =>
              props.navigation.navigate("Appointment", {
                screen: "ViewAppointment",
              })
            }
          />
          <DrawerItem
            labelStyle={{
              fontSize: 14 * responsive(),
              color: "white",
            }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="update"
                color={"white"}
                size={size}
              />
            )}
            label="Update Appointment"
            onPress={() =>
              props.navigation.navigate("Appointment", {
                //screen: "UpdateAppointment",
                screen: "ViewAppointment",
              })
            }
          />
          {user.role === 3 && (
            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
                color: "white",
              }}
              icon={({ color, size }) => (
                <AntDesign name="adduser" color={"white"} size={size} />
              )}
              label="Add Holidays"
              onPress={() =>
                props.navigation.navigate("Appointment", {
                  screen: "AddUnavailability",
                })
              }
            />
          )}

          {false && (
            <DrawerItem
              labelStyle={{
                fontSize: 14 * responsive(),
              }}
              icon={({ color, size }) => (
                <AntDesign name="adduser" color={color} size={size} />
              )}
              label="send-notifications"
              onPress={() => props.navigation.navigate("sendNotifications")}
            />
          )}

          <DrawerItem
            labelStyle={{
              fontSize: 14 * responsive(),
              color: "white",
            }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={"white"}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => props.navigation.navigate("Profile")}
          />
        </Drawer.Section>

        <Button
          title={"Log Out"}
          buttonTextStyle={{ fontSize: isTablet() ? 18 : 16 }}
          buttonStyle={{ width: "80%" }}
          onPress={logOut}
        ></Button>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    // flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
    flex: 1,
    paddingHorizontal: 20,
    //color: "black",
    color: "white",
  },
  caption: {
    color: "black",
    fontSize: 13 * responsive(),
    lineHeight: 14 * responsive(),
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
    marginTop: 15,
    borderWidth: 0,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
