import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { toggleTheme } from "../actions";

export default function Home(props) {
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener("tabPress", (e) => {
      e.preventDefault();
      props.navigation.openDrawer();
    });

    return unsubscribe;
  }, [props.navigation]);

  return null;
}
