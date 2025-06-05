import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  PixelRatio,
} from "react-native";
// packages
import AntDesign from "react-native-vector-icons/AntDesign";
// constants
import configResponse from "../config/constant";
import { Dimensions } from "react-native";
import { responsive } from "../helper/responsive";

export default function Settings({ navigation }) {
  const linksData = [
    {
      id: "1",
      linkName: "Privacy Policy",
      onclick: () => navigation.navigate("PrivacyPolicy"),
    },
    {
      id: "2",
      linkName: "About Us",
      onclick: () => navigation.navigate("AboutUs"),
    },
    {
      id: "3",
      linkName: "My Account",
      onclick: () => navigation.navigate("Profile"),
    },
    // {
    //     id: "4",
    //     linkName: "Change Password",
    //     onclick: () => navigation.navigate('Password')
    // },
    // {
    //     id: "5",
    //     linkName: "Contact Us",
    //     onclick: () => navigation.navigate('Contact')
    // },
    {
      id: "6",
      linkName: "Feedback",
      onclick: () => navigation.navigate("Feedback"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container_child}>
        {linksData.map((data) => (
          <Pressable
            key={data.id}
            style={styles.linkButton}
            onPressIn={data.onclick}
          >
            <Text style={styles.ItemText}>{data.linkName}</Text>
            {/* <Icon style={styles.LeftIcon} name='arrow-right-circle' size={18}  /> */}
            <AntDesign style={styles.LeftIcon} name="right" size={18} />
          </Pressable>
        ))}
        <Text style={styles.BottomText}>App Version 1.2.0</Text>
      </View>
    </SafeAreaView>
  );
}
// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_child: {
    display: "flex",
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    paddingVertical: 30,
    paddingHorizontal: 30,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  linkButton: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    position: "relative",
    marginBottom: 15,
    borderColor: "#fff",
  },
  ItemText: {
    fontSize: 18 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#333",
    width: "100%",
  },
  LeftIcon: {
    color: "#333",
    width: "10%",
    marginTop: 8,
    position: "absolute",
    right: 0,
    top: 0,
  },
  BottomText: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#333",
    width: "100%",
    textAlign: "center",
    marginTop: 60,
    position: "absolute",
    right: 0,
    bottom: 20,
  },
});
