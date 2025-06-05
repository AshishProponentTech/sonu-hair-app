import * as React from "react";
import { Appbar } from "react-native-paper";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { getHeaderTitle } from "@react-navigation/elements";
import { responsive } from "../../../helper/responsive";

const Header = ({ navigation, previous, showMenu, options, route }) => {
  const title = getHeaderTitle(options, route.name);

  const show = showMenu === undefined ? true : showMenu;
  const { user } = useSelector((state) => state.Auth);

  return (
    <View style={[styles.headerContainer, { backgroundColor: "#FFC000" }]}>
      {previous ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : (
        show && (
          <Appbar.Action
            icon="menu"
            color="#333333"
            onPress={() => navigation.toggleDrawer()}
          />
        )
      )}
      <Text style={styles.headerHeading}>{title === "Home" ? "" : title} </Text>
      {user?.name && title === "Home" && (
        <View style={styles.infoWrapper}>
          <Text style={styles.infoNameHeading}>Hi, {user.name}</Text>
          <Text>
            <AntDesign name="enviroment" size={15} /> {user.city}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerHeading: {
    fontWeight: "bold",
    fontSize: 18 * responsive(),
  },
  infoWrapper: {
    position: "absolute",
    right: 15,
  },
  infoNameHeading: {
    fontWeight: "bold",
  },
});

export default Header;
