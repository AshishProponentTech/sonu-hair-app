// components/AnimatedSplash.js
import { useEffect, useRef } from "react";
import { Platform, View, StyleSheet, Image, Animated } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import splash from "../assets/images/background/SplashBackground.png";
import logo from "../assets/logo2.png";

export function AnimatedSplash() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const overlayFadeAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;
  const developerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(overlayFadeAnim, {
      toValue: 0.6,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(developerFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <View style={styles.splashContainer}>
      <Image source={splash} style={styles.backgroundImage} resizeMode="cover" />
      <Animated.View style={[styles.overlay, { opacity: overlayFadeAnim }]} />
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.titleText, { opacity: titleFadeAnim }]}>
            SONU HAIR CUT
          </Animated.Text>
          <Animated.Text style={[styles.subtitleText, { opacity: subtitleFadeAnim }]}>
            HAIR SALON
          </Animated.Text>
          <Animated.Text style={[styles.developerText, { opacity: developerFadeAnim }]}>
            Developed by proponent technologies
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: "black" },
  backgroundImage: { width: wp("100%"), height: hp("100%"), position: "absolute" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "black" },
  logoContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: wp("60%"), height: wp("60%"), marginBottom: 20 },
  textContainer: { alignItems: "center" },
  titleText: {
    fontSize: wp("7%"),
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    color: "#D1AE6C",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 2
  },
  subtitleText: {
    fontSize: wp("5.5%"),
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    color: "white", marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1.5
  },
  developerText: {
    fontSize: wp("3%"),
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    color: "white",
    opacity: 0.8,
    textAlign: "center"
  },
});
