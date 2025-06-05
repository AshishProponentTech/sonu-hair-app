import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyHeader from "./header";
import Home from "../screens/Home";
import Service from "../screens/Service";
import TimeSlot from "../screens/TimeSlot";
import BookingConfirmation from "../screens/BookingConfirmation";
import { AppStateContext } from "./AppStateContaxt";
import UpcomingBooking from "../screens/UpcomingBooking";

function ServiceStack() {
  const Stack = createNativeStackNavigator();
  const [locationModal, setLocationModal] = React.useState(false);
  const [location, setLocations] = React.useState("");

  const data = {
    locationModal,
    setLocationModal,
    location,
    setLocations,
  };
  return (
    <AppStateContext.Provider value={data}>
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
          options={{ headerShown: true, headerTitle: "Confirm Booking" }}
        />
        {/* <Stack.Screen
          name="MyAppointment"
          component={UpcomingBooking}
          options={{ headerShown: true, headerTitle: "Confirm Booking" }}
        /> */}
      </Stack.Navigator>
    </AppStateContext.Provider>
  );
}

export default ServiceStack;
