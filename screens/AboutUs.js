import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image,
  PixelRatio,
} from "react-native";
// constants import
import configResponse from "../config/constant";
// images import
import Logo from "../assets/images/logo.png";
import Background from "../assets/images/background/Hair_Salon_Stations.jpg";
import { Dimensions } from "react-native";
import { responsive } from "../helper/responsive";
import ScreenHeader from "../components/screenHeader";
import { useNavigation } from "@react-navigation/native";
export default function AboutUs() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Background}
        resizeMode="cover"
        style={styles.image}
      >
        <ScreenHeader
          title={"About Us"}
          onPress={() => navigation.goBack()}
          mainStyle={{ height: "8%" }}
        />
        <View style={styles.container_child}>
          <Image source={Logo} style={styles.Logo} />
          <Text style={styles.title}>About Sonu Hair Cut</Text>
          <Text style={styles.Para}>
            Enhancing beauty since 1997, Sonu Haircut has developed a familiar
            and reliable industry brand. We are Surrey and Delta's go to beauty
            salon for waxing, Laser, Dermalase facials threading, hair styling,
            make-up and all kind Bridal and Non Bridal services, and so much
            more. We do all kind Home Services for Bridal. Rest assured you will
            walk out of Sonu Haircut feeling confident, looking beautiful, and
            party ready.
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_child: {
    backgroundColor: "#000000c0",
    display: "flex",
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    paddingTop: "15%",
    // justifyContent: "center",
    flexWrap: "wrap",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22 * responsive(),
    fontFamily: "Inter_700Bold",
    color: configResponse.primaryBackground,
    marginBottom: 10,
  },
  Para: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#ffffff",
    width: "100%",
    textAlign: "center",
  },
  Logo: {
    width: 150 * responsive(),
    height: 150 * responsive(),
    resizeMode: "cover",
    marginBottom: 10,
  },
});
