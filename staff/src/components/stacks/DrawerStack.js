import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

//Screens

import DrawerContent from "../CustomDrawer";
import TabNavigator from "../Navigators";
import { touchProps } from "react-native-web/dist/cjs/modules/forwardedProps";
import ViewProfile from "../../screens/Profile/ViewProfile";
import AddUnavailability from "../../screens/Appointment/AddUnavailability";
import UpdateAppointment from "../../screens/Appointment/UpdateAppointment";
import Header from "../Header";
import { Dimensions, SafeAreaView, Text } from "react-native";
import Index from "../../screens/notification test/Index";
import { responsive } from "../../../../helper/responsive";

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
  return (
    <>
      <Drawer.Navigator
        initialRouteName=""
        // inactiveBackgroundColor="red"
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            //backgroundColor: "#FFC000",
          },
          headerTintColor: "black",
          //header: (props) => <Header {...props} />,
        }}
      >
        <Drawer.Screen
          name="Article"
          component={TabNavigator}
          options={{
            headerShown: false,
            title: "Home",
            headerTitleStyle: {
              fontSize: 18 * responsive(),
            },
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ViewProfile}
          options={{
            headerShown: false,
            title: "Profile",
            headerTitleStyle: {
              fontSize: 18 * responsive(),
              //   headerShown: false,
            },
          }}
        />

        <Drawer.Screen
          name={"sendNotifications"}
          component={Index}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 18 * responsive(),
            },
          }}
        ></Drawer.Screen>
      </Drawer.Navigator>
    </>
  );
}
