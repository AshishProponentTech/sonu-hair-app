import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { connect, useSelector, useDispatch } from "react-redux";
//Screens
import AuthLoading from "../screens/Auth/AuthLoading";
import AuthStack from "./stacks/AuthStack";
import AppIntro from "../screens/AppIntro/AppIntro";
import MainAppStack from "./stacks/DrawerStack";
import { getUserToken, saveUserToken, LoadUser } from "../actions";
import { useEffect } from "react";

const Stack = createStackNavigator();

function RootStack(props) {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.Auth);
  useEffect(() => {
    const loadusr = () => dispatch(LoadUser(token));
    try {
      if (!isAuthenticated && token !== null) {
        loadusr();
      }
    } catch (error) {
      alert(error);
    }
    dispatch(getUserToken());
    setTokenState(props?.auth?.token);
  }, [isAuthenticated, token]);

  const [tokenState, setTokenState] = React.useState(props?.auth?.token);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {typeof tokenState == "string" ? (
        <Stack.Screen name="MainAppStack" component={MainAppStack} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => ({
  auth: state.Auth,
  appIntroStatus: state.ShowAppIntro.appIntroStatus,
  color: state.Theme.colorData,
});

const mapDispatchToProps = (dispatch) => ({
  getUserToken: () => dispatch(getUserToken()),
  isAppIntroStatus: (status) => dispatch(isAppIntroStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootStack);
