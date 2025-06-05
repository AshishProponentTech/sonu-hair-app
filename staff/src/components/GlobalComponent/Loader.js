import React from "react";
import { View, Text } from "react-native";
import Modal from "react-native-modal";
import { UIActivityIndicator } from "react-native-indicators";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Loader = (props) => {
  return (
    <Modal
      isVisible={true}
      style={{ backgroundColor: "#ffffff00", margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackButtonPress={() => props.navigation.goBack()}
      coverScreen={false}
      backdropOpacity={0.8}
      hideModalContentWhileAnimating={true}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          backgroundColor: "white",
          width: wp("40"),
          height: hp("15"),
          borderRadius: 20,
        }}
      >
        <UIActivityIndicator color={props.color.primaryColor} size={30} />
      </View>
    </Modal>
  );
};

export default Loader;
