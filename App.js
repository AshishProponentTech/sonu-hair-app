import Client from "./mainClient";
import Staff from "./staff/mainStaff";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import Decider from "./screens/Decider";
import store from "./staff/src/store";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const Stack = createStackNavigator();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    primary_font: Inter_400Regular, // Optional: alias for consistent naming
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <RootSiblingParent>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="screenDecider" component={Decider} />
                <Stack.Screen name="clientMain" component={Client} />
                <Stack.Screen name="StaffMain" component={Staff} />
              </Stack.Navigator>
            </RootSiblingParent>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
