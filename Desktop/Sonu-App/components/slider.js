import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import newsdata from "../service/news";
import { useIsFocused } from "@react-navigation/core";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsive } from "../helper/responsive";

const DashboardSlider = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [news, setNews] = useState([]);
  const [count, setCount] = useState(0);

  const getNews = () => {
    newsdata()
      .then((res) => {
        setNews(res.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getNews();
  }, [isFocused]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === news.length) {
      setCount(0);
    }
  }, [count]);

  return (
    <View style={styles.element}>
      <Pressable
        onPress={() =>
          navigation.navigate("NewsDetails", { data: news[count] })
        }
      >
        <Image
          resizeMode="contain"
          style={styles.slider}
          source={{ uri: news[count]?.news_image }}
        />
        <View style={styles.linkFlex}>
          <Text style={styles.title}>{news[count]?.title}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default DashboardSlider;

const styles = StyleSheet.create({
  element: {
    borderWidth: 1,
    maxWidth: 500,
    display: "flex",
    borderColor: "lightgray",
    overflow: "hidden",
    position: "relative",
    borderRadius: 6,
    marginBottom: 100,
  },
  slider: {
    height: 150,
    height: Math.max(hp("20%", 150)),
  },
  linkFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 5,
  },
  link: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderColor: "#6495ED",
  },
  linkText: {
    color: "#6495ED",
  },
  title: {
    fontSize: 14 * responsive(),
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingTop: 10,
  },
  description: {
    fontSize: 14 * responsive(),
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
