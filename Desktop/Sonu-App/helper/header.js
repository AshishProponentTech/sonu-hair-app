import * as React from "react";
import { Appbar } from "react-native-paper";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  PixelRatio,
  Dimensions,
} from "react-native";
import configResponse from "../config/constant";
import Icon from "react-native-vector-icons/Feather";
import * as SecureStore from "expo-secure-store";
import Location from "../screens/Location";
import { AppStateContext } from "./AppStateContaxt";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { responsive } from "./responsive";

const MyHeader = (props) => {
  const { setLocationModal, locationModal, location } =
    React.useContext(AppStateContext);

  const { options, navigation, route } = props;
  const _goBack = () => {
    // route.name == "Service"
    //   ? navigation.navigate("ServiceStack")
    //:
    navigation.goBack();
  };

  const _location = async () => {
    await SecureStore.setItemAsync("ModalLocation", "true");
    setLocationModal(true);
  };

  // const _location = () => {
  //   setLocationModal(!locationModal);
  // };

  const rightMenu = navigation.canGoBack() ? "flex" : "none";
  const width = Dimensions.get("window").width;
  return (
    <Appbar.Header style={styles.TopHeader}>
      {navigation.canGoBack() ? (
        <Appbar.BackAction onPress={_goBack} />
      ) : (
        <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      )}
      <View style={[styles.textWrapper, { width: width / 1.5 }]}>
        <Text style={styles.header}>{options?.headerTitle}</Text>
      </View>
      <Location />
    </Appbar.Header>
  );
};

export default MyHeader;

const styles = StyleSheet.create({
  TopHeader: {
    backgroundColor: "#D2AE6A",
    paddingHorizontal: 10,
    height: 80,
    //marginBottom: 80,
    flexDirection: "row",
    //justifyContent: "space-between",
    //width: "90%",
    //borderWidth: 1,
  },
  header: {
    fontSize: 18 * responsive(),
    fontWeight: "bold",
  },
  location: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    //width: widthDimension,
    //display: "flex",
    //flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    //position: "absolute",
    // left: "35%",
  },
});
