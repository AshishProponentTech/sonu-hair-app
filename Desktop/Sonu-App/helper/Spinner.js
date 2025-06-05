import React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const Spinner = () => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
        {[...Array(8)].map((_, i) => (
          <View 
            key={i}
            style={[
              styles.dot,
              {
                transform: [
                  { rotate: `${i * 45}deg` },
                  { translateX: 20 }
                ]
              }
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  spinner: {
    width: 60,
    height: 60,
    position: "relative",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D2AE6A",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -3,
    marginTop: -3,
  },
});

export default Spinner;