import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyHeader from "./header";
import Home from "../screens/Home";
import Service from "../screens/Service";
import TimeSlot from "../screens/TimeSlot";
import BookingConfirmation from "../screens/BookingConfirmation";

function ServiceStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="ServiceStack"
      screenOptions={{
        headerMode: "float",
        header: (props) => <MyHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="ServiceStack"
        options={{ headerShown: false, headerTitle: "Services" }}
        component={Home}
      />
      <Stack.Screen
        name="Service"
        options={{ headerShown: false, headerTitle: "Choose Service" }}
        component={Service}
      />
      <Stack.Screen
        name="Staff"
        component={TimeSlot}
        options={{ headerShown: false, headerTitle: "Date & Time" }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingConfirmation}
        options={{ headerShown: false, headerTitle: "Confirm Booking" }}
      />
      {/* <Stack.Screen
        name="Booking"
        component={BookingConfirmation}
        options={{ headerShown: false, headerTitle: "Confirm Booking" }}
      /> */}
      {/* <Stack.Screen
        name="UpBooking"
        component={UpcomingBooking}
        options={{ headerShown: false, headerTitle: "Confirm Booking" }}
      /> */}
    </Stack.Navigator>
  );
}

export default ServiceStack;
