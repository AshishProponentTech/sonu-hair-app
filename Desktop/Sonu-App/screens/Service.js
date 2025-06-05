import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import ServiceLoader from "../helper/serviceLoader";
// services
import { getService } from "../service/CategoryWiseService";
// constants
import configResponse from "../config/constant";
import { AppStateContext } from "../helper/AppStateContaxt";
import { useIsFocused } from "@react-navigation/native";
import { responsive } from "../helper/responsive";

import { isTablet } from "../components/tablet";
import ScreenHeader from "../components/screenHeader";
function Service({ navigation, route }) {
  const isFocused = useIsFocused();
  const data = route?.params?.id;

  const { guestMode } = React.useContext(AppStateContext);

  const [isLoading, setIsLoading] = useState(false);
  const [getServiceData, setService] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const checkTablet = isTablet();
  function Item() {
    const itemdata = [];
    for (const [key, value] of Object.entries(getServiceData)) {
      const image = { uri: value["image"] };
      itemdata.push(
        <Pressable
          android_disableSound={true}
          android_ripple={{ color: "transparent" }}
          onPress={() => {
            if (guestMode) {
              setShowMessage(true);
              return;
            }
            navigation.navigate("Staff", {
              id: value["id"],
            });
          }}
          style={[styles.SubUlgrid, styles.shadowProp, styles.serviceCol]}
          key={value["id"]}
        >
          <View style={checkTablet ? styles.imgWrapTablet : styles.imgWrapMobile}>
            <Image
              resizeMode="cover"
              style={checkTablet ? styles.picTablet : styles.picMobile}
              source={image}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} >
              {value["name"]}
            </Text>
            <Text style={[styles.bottomText]}>
              Duration: {value["duration"]}{" "}
            </Text>
          </View>
        </Pressable>
      );
    }
    return itemdata;
  }

  useEffect(() => {
    setIsLoading(true);

    getService(data)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data?.data;
          setService(output);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }, [data]);

  useEffect(() => {
    setShowMessage(false);
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={"Choose Service"}
        onPress={() => navigation.goBack()}
      />
      {guestMode && showMessage && (
        <View style={[styles.messageWrapper]}>
          <Text style={styles.signUpMessage}>
            We appreciate your interest in our app! To access our full range of
            services, please log in or sign up.
          </Text>
          <Text style={styles.signUpMessage}>Thank you!</Text>
          <Pressable onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpBtn}>Sign Up Now</Text>
          </Pressable>
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.MasterView}>
          {!isLoading ? <Item /> : <ServiceLoader />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Service;

// stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFFFFF",
  },
  modal: {
    borderWidth: 1,
    backgroundColor: "#D3D3D3",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  MasterView: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 20,
    backgroundColor: "white",
    paddingBottom: 100,
  },
  serviceCol: {
    width: "90%",
    height: "auto",
    marginBottom: 15,
    padding: 7 * responsive(),
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "#D2AE6A",
    display: "flex",
    gap: 10,
  },
  SubUlgrid: {
    borderRadius: 7,
    backgroundColor: "#ffffff",
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row",

    padding: 5,

    width: "100%",
    alignItems: "center",
  },
  shadowProp: {
    shadowColor: "#ffedcb",
    shadowOffset: {
      width: 3,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  title: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#D2AE6A",
    fontWeight: "700",
    marginBottom: 3,
  },
  imgWrapMobile: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#edd7ae',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 5,
  },
  imgWrapTablet: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#edd7ae',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picMobile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  picTablet: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  bottomText: {
    fontSize: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#555555",
    fontWeight: "700",
  },
  scrollStyle: {
    height: "auto",
  },
  messageWrapper: {
    backgroundColor: "#ffe6e5",
    display: "flex",
    flexDirection: "column",
    margin: 20,
    alignItems: "flex-start",
    borderColor: "#ff8c8a",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
  signUpMessage: {
    color: "#ff8c8a",
    marginBottom: 10,
  },
  signUpBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderColor: "#ff8c8a",
    color: "#ff8c8a",
  },
});
