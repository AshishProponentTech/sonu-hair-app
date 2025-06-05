import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  View,
  SafeAreaView,
  ScrollView,
  Linking,
  Text,
  StyleSheet,
  Pressable,
  PixelRatio,
  Dimensions,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";
import { responsive } from "../helper/responsive";
import ScreenHeader from "../components/screenHeader";
import { useNavigation } from "@react-navigation/native";
const Contact = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <ScreenHeader title={"Contact Us"} onPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <View style={styles.iconWrapper}>
              <Entypo name="phone" size={25} style={styles.icon} />
              <Text style={styles.heading}>Phone Number</Text>
            </View>
            <Pressable onPress={() => Linking.openURL("tel:+16045814565")}>
              <Text style={styles.text}>604 581 4565</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL("tel:+16047604400")}>
              <Text style={styles.text}>604 760 4400</Text>
            </Pressable>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.iconWrapper}>
              <Entypo name="location-pin" size={25} style={styles.icon} />
              <Text style={styles.heading}>Our Location</Text>
            </View>
            <Text style={styles.text}>9249 120 St</Text>
            <Text style={styles.text}>Delta, BC</Text>
            <Text style={styles.text}>V4C 6R8</Text>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.iconWrapper}>
              <Entypo name="mail" size={25} style={styles.icon} />
              <Text style={styles.heading}>Email Address</Text>
            </View>
            <Pressable
              onPress={() => Linking.openURL("mailto:info@sonuhaircut.ca")}
            >
              <Text style={styles.text}>info@sonuhaircut.ca</Text>
            </Pressable>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name="web"
                size={25}
                style={styles.icon}
              />
              <Text style={styles.heading}>Website</Text>
            </View>
            <Pressable
              onPress={() => Linking.openURL("https://sonuhaircut.ca/")}
            >
              <Text style={styles.text}>www.sonuhaircut.ca</Text>
            </Pressable>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.iconWrapper}>
              <Entypo name="link" size={25} style={styles.icon} />
              <Text style={styles.heading}>Social Links</Text>
            </View>
            <View
              style={[styles.iconWrapper, { marginLeft: 30, marginTop: 15 }]}
            >
              <Pressable
                onPress={() =>
                  Linking.openURL("https://www.instagram.com/sonuhaircut/")
                }
              >
                <Entypo
                  name="instagram"
                  size={25}
                  style={[styles.icon, { marginRight: 20 }]}
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL("https://www.facebook.com/jaz.gaba")
                }
              >
                <Entypo name="facebook" size={25} style={styles.icon} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: wp("100%"),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    paddingLeft: 40,
    marginTop: 5,
    maxWidth: 200,
    fontSize: 16 * responsive(),
  },
  wrapper: {
    width: wp("90%"),
    marginBottom: 20,
    marginTop: 20,
  },
  iconWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  heading: {
    color: "#333",
    fontSize: 20 * responsive(),
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
});
