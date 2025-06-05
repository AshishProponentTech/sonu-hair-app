import * as React from "react";
import { Dimensions } from "react-native";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ScrollView,
  PixelRatio,
} from "react-native";
import { responsive } from "../helper/responsive";

const NewsDetails = ({ route, navigation }) => {
  const { data } = route.params;
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.element}>
          <Image
            resizeMode="cover"
            style={styles.slider}
            source={{ uri: data?.news_image }}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{data?.title}</Text>
          <Text style={[styles.date]}>Date: {data?.date}</Text>
          <Text style={styles.description}>{data?.description}</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("ServiceStack", { screen: "Dashboard" })
            }
          >
            <Text style={styles.goBack}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: 12 * responsive(),
    padding: 5,
    color: "gray",
  },
  goBack: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
    width: 100,
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#FFD700",
    fontSize: 12 * responsive(),
  },
  textContainer: {
    marginTop: 20,
  },
  slider: {
    height: 200,
    width: "100%", // Set the width to the screen width to fit one item at a time
  },

  link: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderColor: "#6495ED",
  },
  linkText: {
    color: "#6495ED",
  },
  element: {
    borderWidth: 1,
    width: "100%", // Set the width to the screen width to fit one item at a time
    borderColor: "lightgray",
    overflow: "hidden",
  },
  title: {
    fontSize: 20 * responsive(),
    fontWeight: "bold",
    padding: 5,
  },
  description: {
    fontSize: 16 * responsive(),
    padding: 5,
    width: 345,
  },
});
