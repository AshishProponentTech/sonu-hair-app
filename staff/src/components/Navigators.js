import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { connect, useSelector } from "react-redux";
import {MaterialCommunityIcons, SimpleLineIcons }from "react-native-vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HomeStack from "./stacks/HomeStack";
import AppointmentStack from "./stacks/AppointmentStack";
import CreateAppointmentStack from "./stacks/CreateAppointmentStack";
import { responsive } from "../../../helper/responsive";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }) => {
  const { index } = state;
  const focusedColor = "#EECA86";
  const inactiveColor = "white";
  const { visible } = useSelector((state) => state.feature);

  if (visible) return null;

  return (
    <View style={styles.container}>
      {/* Gradient Background with Curved Top */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#D2AE6A', '#B18843']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.backgroundGradient}
        >
          <View style={styles.curveMask} />
        </LinearGradient>
      </View>

      {/* Tab Bar Content */}
      <View style={styles.tabBarContent}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("Home")}
        >
          <SimpleLineIcons
            name="home"
            color={index === 0 ? 'white' : inactiveColor}
            size={24 * responsive()}
          />
          <Text style={[
            styles.tabLabel,
            index === 0 && styles.activeTabLabel
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Hidden Spacer for Center Button */}
        <View style={styles.hiddenSpacer} />

        {/* Appointments Tab */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("Appointment")}
        >
          <SimpleLineIcons
            name="calendar"
            color={index === 2 ? focusedColor : inactiveColor}
            size={24 * responsive()}
          />
          <Text style={[
            styles.tabLabel,
            index === 2 && styles.activeTabLabel
          ]}>
            Appointments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Center Button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("Book")}
      >
        <LinearGradient
          colors={['#EECA86', '#D2AE6A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerButtonGradient}
        >
          <MaterialCommunityIcons
            name="plus"
            color={index === 1 ? "white" : "white"}
            size={40}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const App = (props) => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Book" component={CreateAppointmentStack} />
      <Tab.Screen name="Appointment" component={AppointmentStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.select({
      ios: 80,
      android: 75,
    }),
  },
  backgroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    overflow: 'hidden',
  },
  backgroundGradient: {
    width: '100%',
    height: '100%',
  },
  curveMask: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    top: -25,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 20,
    paddingBottom: Platform.select({
      ios: 25,
      android: 15,
    }),
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: 0,
  },
  hiddenSpacer: {
    flex: 1,
  },
  tabLabel: {
    color: 'white',
    fontSize: 12 * responsive(),
    marginTop: 6,
  },
  activeTabLabel: {
    color: '#fff',
    fontWeight: "900",
  },
  centerButton: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 50,
      android: 40,
    }),
    left: '50%',
    marginLeft: -30,
    width: 70,
    height: 70,
    zIndex: 10,
  },
  centerButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
});

const mapStateToProps = (state) => ({
  color: state.Theme.colorData,
});

export default connect(mapStateToProps)(App);