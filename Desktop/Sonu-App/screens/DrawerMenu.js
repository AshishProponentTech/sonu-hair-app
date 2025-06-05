import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HeaderDrawerMenu from "../components/header";
import ServiceStack from "../helper/serviceStack";
import ChangePassword from "../screens/ChangePassword";
import UpcomingBooking from "../screens/UpcomingBooking";
import Settings from "./Settings";
import PrivacyPolicy from "./PrivacyPolicy";
import Profile from "../screens/Profile";
import AboutUs from "./AboutUs";
import Contact from "./Contact";
import Home from "../screens/Home";
import Service from "./Service";
import Feedback from "./Feedback";
import { RootStateContext } from "../helper/RootStateContext";
import DashboardTab from "../navigator/tabNavigatore";
import NewsDetails from "../components/NewsDeatils";
import { Dimensions, PixelRatio } from "react-native";
import { responsive } from "../helper/responsive";

function DrawerMenu() {
  const Drawer = createDrawerNavigator();
  const [appointmentData, setAppointmentData] = React.useState([]);
  const data = { appointmentData, setAppointmentData };

  return (
    <RootStateContext.Provider value={data}>
      <Drawer.Navigator
        initialRouteName="ServiceStack"
        screenOptions={{
          swipeEnabled: false,
        }}
        drawerContent={(props) => <HeaderDrawerMenu {...props} />}
      >
        <Drawer.Screen
          name="ServiceStack"
          component={DashboardTab}
          options={{
            headerShown: false,
            headerTitle: "",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
          }}
        />
        <Drawer.Screen
          name="Home"
          component={ServiceStack}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="NewsDetails"
          component={NewsDetails}
          options={{
            headerShown: false,
            headerTitle: "Latest Update",
            headerStyle: { backgroundColor: "#FFD700" },
            headerTintColor: "#000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
        <Drawer.Screen
          name="UpcomingBooking"
          component={UpcomingBooking}
          options={{
            headerShown: false,
            headerTitle: "My Appointments",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontSize: 18 * responsive(),
            },
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            headerTitle: "My Profile",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
        <Drawer.Screen
          name="SettingsScreen"
          component={Settings}
          options={{
            headerShown: false,
            headerTitle: "Settings",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
        <Drawer.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerShown: true,
            headerTitle: "Privacy Policy",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
        <Drawer.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            headerShown: false,
            headerTitle: "About Us",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
        <Drawer.Screen
          name="Contact"
          component={Contact}
          options={{
            headerShown: false,
            headerTitle: "Contact Us",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
        <Drawer.Screen
          name="Password"
          component={ChangePassword}
          options={{
            headerShown: false,
            headerTitle: "Change Password",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
        <Drawer.Screen
          name="Feedback"
          component={Feedback}
          options={{
            headerShown: false,
            headerTitle: "Close Account",
            headerStyle: { backgroundColor: "#D2AE6A" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontSize: 18 * responsive() },
          }}
        />
      </Drawer.Navigator>
    </RootStateContext.Provider>
  );
}

export default DrawerMenu;
