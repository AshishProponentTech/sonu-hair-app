import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
// packages
import * as SecureStore from "expo-secure-store";
import Loader from "../helper/loader";
// constants
import configResponse from "../config/constant";
// services
import { AllLocation } from "../service/Location";
import { AppStateContext } from "../helper/AppStateContaxt";
import { ScrollView } from "react-native-gesture-handler";
import { responsive } from "../helper/responsive";
import ScreenHeader from "../components/screenHeader";
import { LinearGradient } from 'expo-linear-gradient';

export default function Location() {
  const { locationModal, setLocationModal, location, setLocation } =
    React.useContext(AppStateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [getLocation, setGetLocation] = useState([]);
  const [userLocation, setUserLocation] = useState(1);
  async function selectLocation(loc) {
    await SecureStore.setItemAsync("location", `${loc.id}`);

    setLocation(loc);
    setLocationModal(!locationModal);
  }
function Item() {
  const itemdata = [];

  for (const [key,value] of Object.entries(getLocation)) {
    itemdata.push(
      <Pressable
        key={value["id"]}
        datakey={key}
        onPress={() => selectLocation(value)}
        style={[
          styles.SubUlgrid,
          styles.shadowProp,
          location.id == value["id"] ? styles.SubUlgridActive : "",
        ]}
      >
        <LinearGradient
          colors={
            location.id == value["id"]
              ? ['#D2AE6A', '#D2AE6A'] 
              : ['#fff6e4d9', '#ffffffd2']         
          }
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 1 }}
          style={{ borderRadius: 8, padding: 10 }}
        >
          <Text
            style={[
              styles.locationName,
              location?.id == value["id"] ? styles.locationNameActive : "",
            ]}
          >
            {value["name"]}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  }
  return itemdata;
}
  useEffect(() => {
    const getData = () => {
      configResponse.userLocation().then((response) => {
        setUserLocation(response);
      });
      setIsLoading(true);
      AllLocation()
        .then((response) => {
          setIsLoading(false);
          if (response?.status == 200) {
            const output = response?.data?.data;
            setGetLocation(output);
          }
        })
        .catch((error) => {
          configResponse.errorMSG(error.message);
        });
    };
    getData();
  }, []);

  useEffect(() => {
    if (getLocation.length) {
      const loc = getLocation.find((l) => userLocation == l.id);
      setLocation(loc);
    }
  }, [getLocation]);
  const closeModal = () => {
    setLocationModal(false);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={locationModal}
      style={{ flex: 1 }}
      onRequestClose={() => setLocationModal(!locationModal)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {isLoading ? (
            <Loader />
          ) : (
            <View>
              <ScreenHeader
                onPress={() => closeModal()}
                title="Choose Your Location"
              />
              <Pressable
                onPressIn={() => setLocationModal(!locationModal)}
                style={styles.closeModel}
              >
              </Pressable>
              <ScrollView style={{}}>
                <View style={{ paddingTop: 20, paddingBottom: 100}}>
                  <Item />
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
// StyleSheet
const styles = StyleSheet.create({
  SubUlgrid: {
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: "#D2AE6A",
    width: "90%",
    alignSelf: "center",
    marginBottom: 12,
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    
  },
  icons: {
    marginRight: 8,
  },
  locationName: {
    fontFamily: configResponse.fontFamily,
    fontSize: 14 * responsive(),
    color: "#000000",
    fontWeight:700,
  },
  SubUlgridActive: {
    backgroundColor: "lightgray",
  },
  locationNameActive: {
    color: "#fff",
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 8,
  },
  bottomText: {
    fontSize: 13 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#70757a",
  },
  Headingtitle: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#000000",
    fontWeight: "400",
    marginBottom: 5,
    width: "100%",
  },
  errorBottomText: {
    fontSize: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#70757a",
    marginBottom: 10,
  },
  CancelBookingText: {
    color: "#ffffff",
    fontFamily: configResponse.fontFamily,
    fontSize: 14 * responsive(),
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    width: "100%", 
    height: "100%", 
    overflow: "hidden",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeModel: {
    width: 30 * responsive(),
    height: 30 * responsive(),
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -10 * responsive(),
    right: -6 * responsive(),
    borderRadius: 30 * responsive(),
  },
  LeftIcon: {
    fontFamily: configResponse.fontFamily,
    fontSize: 26 * responsive(),
    color: "#ffffff",
    backgroundColor: configResponse.primaryBackground,
    borderRadius: 26,
    overflow: "hidden",
  },
});
