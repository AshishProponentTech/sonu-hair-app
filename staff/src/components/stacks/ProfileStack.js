import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/Home";
import { connect } from "react-redux";
import ViewProfile from "../../screens/Profile/ViewProfile";

const Stack = createStackNavigator();

function ProfileStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerShown: false,
        headerStyle: { backgroundColor: props.color.primaryColor },
      }}
    >
      <Stack.Screen name="Profile" component={ViewProfile} />
    </Stack.Navigator>
  );
}

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData,
  };
}

export default connect(mapStateToProps)(ProfileStack);
