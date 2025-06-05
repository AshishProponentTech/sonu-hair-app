import React from "react";
import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { connect } from "react-redux";
import AppIntroSlider from "react-native-app-intro-slider";
import { isAppIntroStatus } from "../../actions";

function AppIntro(props) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle={"dark-content"} />
      <AppIntroSlider
        data={slides}
        renderItem={_renderItem}
        showSkipButton={true}
        onSkip={() => {
          props.isAppIntroStatus({ name: "hide" });
        }}
        onDone={() => {
          props.isAppIntroStatus({ name: "hide" });
        }}
        buttonTextStyle={{ color: "red" }}
      />
    </View>
  );
}

//Function for rendering the App introduction screens
_renderItem = (data) => {
  return (
    <LinearGradient
      colors={data.item.colors}
      style={{
        padding: 15,
        alignItems: "center",
        height: "100%",
        width: data.item.width,
        justifyContent: "center",
      }}
    >
      <Text style={styles.title}>{data.item.title}</Text>
      <Image style={styles.image} source={data.item.image} />
      <Text style={styles.text}>{data.item.text}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  image: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 16,
    color: "#f2f2f2",
    textAlign: "center",
    paddingVertical: 30,
  },
  title: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
});

const slides = [
  {
    key: "somethun",
    title: "Always stay updated with your appointments",
    text: "Daily get an insight of your appointment to keep up with the schedule.Use insights to maintain a proper workflow",
    image: require("../../../assets/staff.png"),
    colors: ["#63E2FF", "#B066FE"],
  },
  {
    key: "somethun1",
    title: "Quick Appointment",
    text: "Make quick appointment with few clicks and provide high quality service to the customer",
    image: require("../../../assets/appoint.png"),
    colors: ["#A3A1FF", "#3A3897"],
  },
  {
    key: "somethun2",
    title: "Do analysis",
    text: "Analyize your appointment with a single click.",
    image: require("../../../assets/growth.png"),
    colors: ["#ffb463", "#6376ff"],
  },
];

const mapStateToProps = (state) => ({
  appIntroStatus: state.ShowAppIntro.appIntroStatus,
  color: state.Theme.colorData,
});

const mapDispatchToProps = (dispatch) => ({
  isAppIntroStatus: (name) => dispatch(isAppIntroStatus(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppIntro);
