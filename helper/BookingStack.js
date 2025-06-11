import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyHeader from "./header";
import Profile from "../screens/Profile";
import UpcomingBooking from "../screens/UpcomingBooking";
function CustomHeader(props) {
  return <MyHeader {...props} />;
}
function BookingStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "float",
        header: CustomHeader,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false, headerTitle: "My Profile" }}
      />
      <Stack.Screen
        name="UpcomingBooking"
        component={UpcomingBooking}
        options={{ headerShown: false, headerTitle: "Upcoming Booking" }}
      />
    </Stack.Navigator>
  );
}
export default BookingStack;