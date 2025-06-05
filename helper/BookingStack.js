import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyHeader from "./header";
import Profile from "../screens/Profile";
import UpcomingBooking from "../screens/UpcomingBooking";

function BookingStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "float",
        header: (props) => <MyHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false, headerTitle: "My Profile" }}
      />
      <Stack.Screen
        name="UpcomingBooking"
        options={{ headerShown: false, headerTitle: "Upcoming Booking" }}
        component={UpcomingBooking}
      />
      {/* <Stack.Screen name="Service" options={{headerShown: true, headerTitle: 'Choose Service'}} component={Service} />
          <Stack.Screen name="Profile" component={Profile} options={{headerShown: true, headerTitle: 'My Profile'}} /> */}
    </Stack.Navigator>
  );
}

export default BookingStack;
