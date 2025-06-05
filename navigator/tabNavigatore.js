import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

import Dashboard from "../screens/Dashboard";
import ServiceStackTab from "../helper/serviceStackTab";
import Profile from "../screens/Profile";
import { AppStateContext } from "../helper/AppStateContaxt";
import { responsive } from "../helper/responsive";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { guestMode } = useContext(AppStateContext);
  const focusedColor = "#EECA86";
  const inactiveColor = "#fff";

  return (
    <View style={styles.tabContainer}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#D2AE6A', '#B18843']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.background}
      >
        <View style={styles.curveMask} />
      </LinearGradient>

      <View style={styles.tabContent}>
        {/* Left tab - Dashboard */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Icon
            name="home"
            size={24 * responsive()}
            color={state.index === 0 ? 'white' : inactiveColor}
          />
          <Text style={[styles.tabLabel, state.index === 0 && styles.activeLabel]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        {/* Spacer for center button */}
        <View style={styles.spacer} />

        {/* Right tab - Profile */}
        {!guestMode && (
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Icon
              name="user"
              size={24 * responsive()}
              color={state.index === 2 ? focusedColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, state.index === 2 && styles.activeLabel]}>
              Profile
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center Floating Button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("Services")}
      >
        <LinearGradient
          colors={['#EECA86', '#D2AE6A']}
          style={styles.centerButtonGradient}
        >
          <MaterialCommunityIcons name="plus" size={40} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const DashboardTab = () => {
  const { guestMode } = useContext(AppStateContext);

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Services" component={ServiceStackTab} />
      {!guestMode && <Tab.Screen name="Profile" component={Profile} />}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.select({ ios: 80, android: 70 }),
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  curveMask: {
    backgroundColor: "transparent",
    height: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: "absolute",
    top: -25,
    width: "100%",
  },
  tabContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 25,
    paddingVertical: Platform.select({ ios: 10, android: 10 }),
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    paddingBottom: 5,
  },
  tabLabel: {
    fontSize: 12 * responsive(),
    color: "white",
    marginTop: 5,
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  spacer: {
    flex: 1,
  },
  centerButton: {
    position: "absolute",
    bottom: Platform.select({ ios: 50, android: 40 }),
    left: "50%",
    marginLeft: -35,
    width: 70,
    height: 70,
    zIndex: 10,
  },
  centerButtonGradient: {
    flex: 1,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
});

export default DashboardTab;
