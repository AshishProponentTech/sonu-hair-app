import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import configResponse from "../config/constant";
const button = ({ title, onPress, buttonTextStyle, buttonStyle }) => {
  return (
    <TouchableOpacity
      style={buttonStyle ? [styles.button, buttonStyle] : styles.button}
      onPress={() => onPress()}
    >
      <Text
        style={
          buttonTextStyle
            ? [styles.buttonText, buttonTextStyle]
            : styles.buttonText
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default button;
const styles = StyleSheet.create({
  button: {
    //backgroundColor: "#FFD700",
    backgroundColor: "#D2AE6A",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 5,
    marginBottom: 15,
    width: "40%",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    //fontFamily: configResponse.fontFamily,
    //color: "#000000",
    color: "white",
    fontWeight: "700",
    marginTop: 1,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
});
