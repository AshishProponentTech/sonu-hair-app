import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
  Modal,
  TextInput,
  PixelRatio,
  TouchableOpacity,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
// constants
import configResponse from "../config/constant";
// services
import { MyBooking, CancelApointment } from "../service/BookingService";
import { RootStateContext } from "./../helper/RootStateContext";
import { AppStateContext } from "../helper/AppStateContaxt";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { responsive } from "../helper/responsive";
import ScreenHeader from "../components/screenHeader";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "../components/button";
import { isTablet } from "../components/tablet";
function UpcomingBooking() {
  const isFocused = useIsFocused();
  const { appointmentData, setAppointmentData } =
    React.useContext(RootStateContext);
  const { setAppointmentCount } = React.useContext(AppStateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setreason] = useState(null);
  const [cancelid, setCancelId] = useState(null);
  const [selectTab, setSelectTab] = useState("Upcoming");
  const [selectId, setSelectId] = useState("");

  // const navigation = useNavigation();
  function UpcomingBooking() {
    const itemdata = [];
    for (const [key, value] of Object.entries(appointmentData)) {
      if (value["status"] == "pending") {
        const image = { uri: value["service_profile"] };

        itemdata.push(
          // <View style={styles.serviceCol} key={key}>
          //   <Pressable style={[styles.SubUlgrid, styles.shadowProp]}>
          //     {/* <Image resizeMode="cover" style={styles.pic} source={image} /> */}
          //     <View style={[styles.details]}>
          //       <Text style={styles.title}>{value["service"]}</Text>
          //       <Text style={[styles.time, styles.bottomText]}>
          //         Specialist: {value["staff_name"]}
          //       </Text>
          //       <Text style={[styles.time, styles.bottomText]}>
          //         Date: {value["date"]}
          //       </Text>
          //       <Text style={[styles.duration, styles.bottomText]}>
          //         Time: {`${value["start_time"]} to ${value["end_time"]}`}{" "}
          //       </Text>
          //       {/* <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text> */}
          //     </View>
          //     <View>
          //       <Pressable
          //         style={styles.CancelBookingButton}
          //         onPress={() => {
          //           setModalVisible(true);
          //           setCancelId(value["id"]);
          //         }}
          //       >
          //         <Text style={styles.CancelBookingText}>Cancel</Text>
          //       </Pressable>
          //       <TouchableOpacity
          //         style={[
          //           styles.CancelBookingButton,
          //           {
          //             backgroundColor: "white",
          //             borderWidth: 1,

          //             borderColor: "#D2AE6A",
          //             marginTop: 10,
          //           },
          //         ]}
          //         onPress={() =>
          //           navigation.navigate("Services", {
          //             params: { id: value["id"] },
          //           })
          //         }
          //       >
          //         <Text
          //           style={[styles.CancelBookingText, { color: "#D2AE6A" }]}
          //         >
          //           Reshudle
          //         </Text>
          //       </TouchableOpacity>
          //     </View>
          //   </Pressable>
          // </View>

          <View style={styles.serviceCol} key={key}>
            <Pressable
              style={[styles.SubUlgrid, styles.shadowProp]}
              onPress={() => setSelectId(value)}
            >
              {/* <Image resizeMode="cover" style={styles.pic} source={image} /> */}
              <View style={[styles.details]}>
                <Text style={styles.title}>{value["service"]}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Feather name="user" size={15} />
                  <Text style={[styles.time, styles.bottomText]}>
                    {" "}
                    Specialist: {value["staff_name"]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Feather name="calendar" size={15} />
                  <Text style={[styles.time, styles.bottomText]}>
                    {" "}
                    Date: {value["date"]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Feather name="clock" size={15} />

                  <Text style={[styles.duration, styles.bottomText]}>
                    {" "}
                    Time: {`${value["start_time"]} to ${value["end_time"]}`}{" "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Ionicons name="location-outline" size={16} />

                  <Text style={[styles.duration, styles.bottomText]}>
                    {" "}
                    Location: {value["location"]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  {/* <Ionicons name="location-outline" size={16} /> */}
                  <Feather name="dollar-sign" size={15} />
                  <Text style={[styles.duration, styles.bottomText]}>
                    {" "}
                    Price: ${value["price"]}
                  </Text>
                </View>

                {/* <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text> */}
              </View>
            </Pressable>
            {selectId.id === value.id ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                {/* <Pressable
                style={styles.CancelBookingButton}
                onPress={() => {
                  setModalVisible(true);
                  setCancelId(value["id"]);
                }}
              >
                <Text style={styles.CancelBookingText}>Cancel</Text>
              </Pressable> */}
                <Button
                  title="Cancel"
                  onPress={() => {
                    setModalVisible(true);
                    setCancelId(value["id"]);
                  }}
                  buttonStyle={{
                    marginVertical: 10,
                    width: "30%",
                    paddingVertical: 5,
                    backgroundColor: "#c42c0e",
                  }}
                  buttonTextStyle={{ fontSize: 15 }}
                />
                {/* <TouchableOpacity
                style={[
                  styles.CancelBookingButton,
                  {
                    backgroundColor: "white",
                    borderWidth: 1,

                    borderColor: "#D2AE6A",
                    marginTop: 10,
                    width: "40%",
                  },
                ]}
                onPress={() =>
                  navigation.navigate("Services", {
                    params: { id: value["id"] },
                  })
                }
              >
                <Text style={[styles.CancelBookingText, { color: "#D2AE6A" }]}>
                  Reshudle
                </Text>
              </TouchableOpacity> */}

                <Button
                  title="Reschedule"
                  onPress={() => {
                    navigation.navigate("Services", {
                      params: { id: value["id"] },
                    });
                    setAppointmentId(value["id"]);
                  }}
                  buttonStyle={{
                    marginVertical: 10,
                    width: "30%",
                    paddingVertical: 5,
                    backgroundColor: "#D2AE6A",
                  }}
                  buttonTextStyle={{ fontSize: 15 }}
                />

                <Button
                  title="Call"
                  onPress={() => Linking.openURL(`tel:${value["phone"]}`)}
                  buttonStyle={{
                    marginVertical: 10,
                    width: "30%",
                    paddingVertical: 5,
                    backgroundColor: "#00e08a",
                  }}
                  buttonTextStyle={{ fontSize: 15 }}
                />
              </View>
            ) : null}
          </View>
        );
      }
    }
    if (itemdata.length < 1) {
      itemdata.push(
        <Text key="key" style={styles.errorBottomText}>
          No booking available.
        </Text>
      );
    }

    return itemdata;
  }

  function CancelBooking() {
    const itemdata = [];
    for (const [key, value] of Object.entries(appointmentData)) {
      if (value["status"] == "cancelled") {
        const image = { uri: value["service_profile"] };
        itemdata.push(
          <View style={styles.serviceCol} key={"cancel" + value["id"]}>
            <Pressable style={[styles.SubUlgrid, styles.shadowProp]}>
              <Image resizeMode="contain" style={styles.pic} source={image} />

              <View style={[styles.details, { width: "70%" }]}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    marginBottom: 5,
                    paddingBottom: 2,
                    width: "100%",
                  }}
                >
                  <Text style={styles.title}>{value["service"]}</Text>
                </View>
                <Text style={[styles.time, styles.bottomText]}>
                  Specialist: {value["staff_name"]}
                </Text>
                <Text style={[styles.time, styles.bottomText]}>
                  Date: {value["date"]}
                </Text>
                <Text style={[styles.duration, styles.bottomText]}>
                  Time: {`${value["start_time"]} to ${value["end_time"]}`}{" "}
                </Text>
                <Text style={[styles.time, styles.bottomText]}>
                  Reason: {value["reason"]}
                </Text>
                {/* <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text> */}
              </View>
            </Pressable>
          </View>
        );
      }
    }
    if (itemdata.length < 1) {
      itemdata.push(
        <Text key="key" style={styles.errorBottomText}>
          No booking available.
        </Text>
      );
    }
    return itemdata;
  }

  function PreviousBooking() {
    const itemdata = [];
    for (const [key, value] of Object.entries(appointmentData)) {
      if (value["status"] == "complete") {
        const image = { uri: value["service_profile"] };
        itemdata.push(
          <View style={styles.serviceCol} key={"complete" + value["id"]}>
            <Pressable style={[styles.SubUlgrid, styles.shadowProp]}>
              <Image resizeMode="contain" style={styles.pic} source={image} />
              <View style={[styles.details, { width: "70%" }]}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    marginBottom: 5,
                    paddingBottom: 2,
                    width: "100%",
                  }}
                >
                  <Text style={styles.title}>{value["service"]}</Text>
                </View>
                <Text style={[styles.time, styles.bottomText]}>
                  Specialist: {value["staff_name"]}
                </Text>
                <Text style={[styles.time, styles.bottomText]}>
                  Date: {value["date"]}
                </Text>
                <Text style={[styles.duration, styles.bottomText]}>
                  Time: {`${value["start_time"]} to ${value["end_time"]}`}{" "}
                </Text>
                {/* <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text> */}
              </View>
            </Pressable>
          </View>
        );
      }
    }
    if (itemdata.length < 1) {
      itemdata.push(
        <Text key="key" style={styles.errorBottomText}>
          No booking available.
        </Text>
      );
    }
    return itemdata;
  }

  const cancelAppointment = () => {
    if (!reason) {
      configResponse.errorMSG("Please enter cancellation reason");
      return;
    }
    if (!cancelid) {
      configResponse.errorMSG("Unexpected error please try again");
      setModalVisible(!modalVisible);
      return;
    }
    const data = {
      booking_id: cancelid,
      remark: reason,
    };
    setIsLoading(true);
    CancelApointment(data)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data;
          configResponse.successMSG(output?.message);
          setreason(null);
          setModalVisible(!modalVisible);
          loadData();
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };

  function loadData() {
    setIsLoading(true);
    const data = { action: "all" };
    MyBooking(data)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data;
          setAppointmentData(output);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }
  const setAppointmentId = async (id) => {
    try {
      const idString = String(id);
      await AsyncStorage.setItem("appointment_id", idString);
    } catch (error) {
      // Handle any errors that occur during AsyncStorage.setItem()
      console.error("Error occurred while setting appointment ID:", error);
    }
  };
  useEffect(() => {
    loadData();
  }, [isFocused]);

  React.useEffect(() => {
    if (appointmentData.length) {
      setAppointmentCount(
        appointmentData.filter((a) => a.status === "pending").length
      );
    }
  }, [appointmentData, isFocused]);
  const navigation = useNavigation();
  const checkTablet = isTablet();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={"My Bookings"}
        onPress={() => navigation.navigate("Dashboard")}
      />
      <ScrollView contentContainerStyle={styles.scrollStyle}>
        <Spinner
          visible={isLoading}
          textContent={"Please wait..."}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.MasterView}>
          <View
            style={{
              flexDirection: "row",
              alignItem: "center",
              marginTop: checkTablet ? 15 : 10,
              marginBottom: 20,
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <View
              style={{
                backgroundColor:
                  selectTab == "Upcoming" ? "#D2AE6A" : "#D9D9D9",
                alignItems: "center",
                justifyContent: "center",
                //borderWidth: 1,
                width: checkTablet ? 150 : 100,
                paddingVertical: 5,
                borderRadius: 10,
              }}
            >
              <Text
                style={[
                  styles.Headingtitle,
                  { color: selectTab == "Upcoming" ? "white" : "black" },
                ]}
                key="title1"
                onPress={() => setSelectTab("Upcoming")}
              >
                {" "}
                Upcoming
              </Text>
            </View>
            <View
              style={{
                backgroundColor:
                  selectTab == "Previous" ? "#D2AE6A" : "#D9D9D9",
                width: checkTablet ? 150 : 100,
                paddingVertical: 5,
                borderRadius: 10,
                alignSelf: "center",
              }}
            >
              <Text
                style={[
                  styles.Headingtitle,
                  { color: selectTab == "Previous" ? "white" : "black" },
                ]}
                key="title2"
                onPress={() => setSelectTab("Previous")}
              >
                {" "}
                Previous
              </Text>
            </View>

            {}
            <View
              style={{
                backgroundColor:
                  selectTab == "CancleTab" ? "#D2AE6A" : "#D9D9D9",
                width: checkTablet ? 150 : 100,
                paddingVertical: 5,
                borderRadius: 10,
              }}
            >
              <Text
                style={[
                  styles.Headingtitle,
                  { color: selectTab == "CancleTab" ? "white" : "black" },
                ]}
                key="title3"
                onPress={() => setSelectTab("CancleTab")}
              >
                {" "}
                Cancelled
              </Text>
            </View>
          </View>

          <View>
            {selectTab == "Upcoming" ? (
              <UpcomingBooking key="item1" />
            ) : selectTab === "Previous" ? (
              <PreviousBooking key="item2" />
            ) : selectTab === "CancleTab" ? (
              <CancelBooking key="item3" />
            ) : null}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.Headingtitle}>Enter Reason </Text>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  onChangeText={setreason}
                  value={reason}
                />
                <View style={styles.cancelbottomdiv}>
                  <Pressable
                    onPress={cancelAppointment}
                    style={styles.sendButton}
                  >
                    <Text style={styles.CancelBookingText}>Submit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setreason(null);
                    }}
                    style={[styles.sendButton, styles.btndanger]}
                  >
                    <Text
                      style={[styles.CancelBookingText, { color: "#ffffff" }]}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UpcomingBooking;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#F6F8FF",
    backgroundColor: "white",
  },
  MasterView: {
    //flex: 1,
    //display: "flex",
    //justifyContent: "center",
    //flexDirection: "row",
    //flexWrap: "wrap",
    //paddingVertical: 20,
    //paddingHorizontal: 10,
  },
  serviceCol: {
    width: "95%",
    height: "auto",
    //padding: 5,
    borderRadius: 10,

    marginBottom: 15,
    //position: "relative",
    backgroundColor: "#f5ebeb",
    //borderWidth: 1,
    alignSelf: "center",
    elevation: 4,
  },
  SubUlgrid: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    //backgroundColor: "#F1F1F1",
    //display: "flex",
    //flexWrap: "nowrap",
    flexDirection: "row",
    padding: 5,
    //alignItems: "center",
    // width: "100%",
    //position: "relative",
    paddingHorizontal: 10,
    paddingVertical: 10,

    // justifyContent: "space-between",
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.23,
    shadowRadius: 9.51,
    elevation: 5,
  },
  title: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    //color: "#000000",
    //marginBottom: 5,
    width: "100%",
    //paddingBottom: 5,
    //borderBottomWidth: 1,
    fontWeight: "800",
  },
  pic: {
    height: 80,
    width: 80,
    borderRadius: 6,
    marginRight: 20,
    //borderWidth: 1,
    alignSelf: "center",
  },
  bottomText: {
    fontSize: 13 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#70757a",
    //paddingBottom: 5,
  },
  Headingtitle: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#000000",
    fontWeight: "400",
    marginLeft: -5,
    textAlign: "center",
    //marginBottom: 5,
    //alignSelf: "center",
    // width: "100%",
    // borderWidth: 1,
    // paddingHorizontal: 10,
    //padding: 10,
    //padding: 5,
    //marginLeft: 10,
    //marginTop: 10,
    // textAlign: "center",
    //paddingVertical: 8,
    //borderRadius: 10,
  },
  errorBottomText: {
    fontSize: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#70757a",
    marginBottom: 10,
    textAlign: "center",
  },
  scrollStyle: {
    height: "auto",
  },
  CancelBookingButton: {
    //backgroundColor: "#FFD700",
    backgroundColor: "#c42c0e",
    paddingHorizontal: 7,
    borderRadius: 4,
    // position: "absolute",
    // right: 15,
    // top: 15,
  },
  sendButton: {
    //backgroundColor: "#FFD700",
    backgroundColor: "#D2AE6A",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
    marginLeft: 5,
  },
  btndanger: {
    // backgroundColor: "#A40000",
    backgroundColor: "red",
  },
  CancelBookingText: {
    //color: "black",
    color: "white",
    fontFamily: configResponse.fontFamily,
    fontSize: 14 * responsive(),
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
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
  cancelbottomdiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 100,
    marginBottom: 18,
    borderRadius: 2,
    color: "#000000",
    fontSize: 16 * responsive(),
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingLeft: 10,
    fontFamily: configResponse.fontFamily,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
