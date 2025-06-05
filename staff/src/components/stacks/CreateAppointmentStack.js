import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddAppointment from "../../screens/Appointment/AddAppointment";
import ViewAppointment from "../../screens/Appointment/ViewAppointment";
import SelectServiceAndTime from "../../screens/Appointment/SelectServiceAndTime";
import AppointmentSummary from "../../screens/Appointment/AppointmentSummary";
import UpdateAppointment from "../../screens/Appointment/UpdateAppointment";
import ClientSelectionAddition from "../../screens/Appointment/ClientSelectionAddition";
import AddUnavailability from "../../screens/Appointment/AddUnavailability";
import { connect } from "react-redux";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome5 } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import Header from "../Header";
import { responsive } from "../../../../helper/responsive";

const Stack = createStackNavigator();

function CreateAppintmentStack(props) {
  const LogoTitle = (propsTwo) => {
    const openDrawer = () => {
      props.navigation.openDrawer();
    };
    return (
      <View style={styles.ViewModel}>
        <Pressable onPress={openDrawer}>
          <FontAwesome5 size={20} name="bars" style={{ marginRight: 30 }} />
        </Pressable>
        <Text style={styles.headerText}>{propsTwo.children}</Text>
      </View>
    );
  };

  return (
    <Stack.Navigator
      initialRouteName="AddAppointment"
      // initialRouteName="SelectServiceAndTime"
      screenOptions={{
        headerTintColor: "black",
        headerShown: false,
        headerStyle: {
          backgroundColor: props.color.primaryColor,
        },
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="AddAppointment"
        component={AddAppointment}
        options={{ headerShown: false, title: "Add Appointment" }}
      />
      <Stack.Screen
        name="SelectServiceAndTime"
        component={SelectServiceAndTime}
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="ClientSelectionAddition"
        component={ClientSelectionAddition}
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="AppointmentSummary"
        component={AppointmentSummary}
        options={{ headerShown: false, title: "" }}
      />
    </Stack.Navigator>
  );
}

function mapStateToProps(state) {
  return { color: state.Theme.colorData };
}

export default connect(mapStateToProps)(CreateAppintmentStack);

const styles = StyleSheet.create({
  ViewModel: {
    width: wp("90"),
    display: "flex",
    flexDirection: "row",
  },
  headerText: {
    fontSize: 18 * responsive(),
    fontWeight: "bold",
  },
});
