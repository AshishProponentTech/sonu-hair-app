import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ServiceStack from "../helper/serviceStack";

function TabMenu() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="ServiceStack" component={ServiceStack} />
    </Tab.Navigator>
  );
}

export default TabMenu;
