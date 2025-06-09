import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Pressable,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { Image } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Headline, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { getSlots, getServices } from "../../actions/appDataActions";
import { useIsFocused } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { responsive } from "../../../../helper/responsive";
import { FlatList } from "react-native-gesture-handler";
import ScreenHeader from "../../../../components/screenHeader";
import { isTablet } from "../../../../components/tablet";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
var moment = require("moment");

function AddAppointment({route, navigation}) {
  const [fetching, setFetching] = useState({ slot: true, service: true });
  const { services, slots, error } = useSelector((state) => state.AppData);
  const { token, user } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const lastPageData = route.params.appointmentData;
  const [err, seterr] = useState("");
  const [selectedService, setSelectedService] = useState({});
  const [selectedSlot, setSelectedSlot] = useState({});
  const [selectedEndSlot, setSelectedEndSlot] = useState(null);
  const [getSlotUpdateData, setGetSlotUpdateData] = React.useState([]);
  //const gradientColor = ["#4a6572", "#3288b1", "#2d576b"];
  const gradientColor = ["#FFFFFF", "#FFFFFF", "#FFFFFF"];

  const gradientStart = [0, 0];
  const gradientEnd = [0, 0];
  const isFocused = useIsFocused();
  const dateTimeString = new Date();
  const dateOnly = moment(dateTimeString).format("YYYY-MM-DD");

  const nextPage = () => {
    if (Object.keys(selectedService).length === 0) {
      seterr("Please Select Service");
      return;
    }
    if (Object.keys(selectedSlot).length === 0) {
      seterr("Please Select Start Time");
      return;
    }
    if (selectedEndSlot == "Invalid date") {
      seterr("Please Select End Time");
      return;
    }
    const appointmentData = {
      ...lastPageData,
      start_time: selectedSlot.startTime,
      end_time: selectedEndSlot,
      service: selectedService,
    };
    navigation.navigate("ClientSelectionAddition", { appointmentData });
  };

  const hanldeStartTimeSlot = (data, idx) => {
    seterr("");
    if (selectedEndSlot.id < idx || selectedEndSlot.id === idx) {
      setSelectedEndSlot({});
    }
    setSelectedSlot({
      id: idx,
      startTime: data,
    });
  };

  const getSlote = () => {
    const { staff } = lastPageData;

    dispatch(
      getSlots(
        token,
        moment(lastPageData.date).format("Y-M-D"),
        selectedService.duration.split(" ")[0],
        staff.id,
        setFetching
      )
    );
  };
  const getService = () => {
    const { staff } = lastPageData;
    dispatch(getServices(token, staff.id, setFetching));
  };

  useEffect(() => {
    getService();
    slots.slot = [];
  }, [isFocused]);

  useEffect(() => {
    selectedService.duration && getSlote();
  }, [selectedService]);

  useEffect(() => {
    if (err != "") {
      Toast.show(err, {
        duration: Toast.durations.LONG,
      });
    }
  }, [err]);

  useEffect(() => {
    if (selectedSlot) {
      const startTime = moment(selectedSlot.startTime, "h:mm a").format(
        "h:mm A"
      );
      let endTime = startTime;
      const serviceTime = selectedService?.duration?.split(" ") || [];
      endTime = moment(endTime, "hh:mm:ss A")
        .add(serviceTime[0], "minutes")
        .format("LTS");
      setSelectedEndSlot(endTime);
    }
  }, [selectedSlot]);
  function getTimesGreaterThanSpecified() {
    const specifiedMoment = moment(new Date(), "hh:mm A");
    const greaterTimes = [];
    if (slots?.slot.length > 0 && slots?.slot) {
      for (const timeString of slots?.slot) {
        const time = moment(timeString, "hh:mm A");
        if (time.isAfter(specifiedMoment)) {
          greaterTimes.push(timeString); // Add the time to the array if it's greater than the specified time
        }
      }
      setGetSlotUpdateData(() => greaterTimes);
    }
  }
  React.useEffect(() => {
    getTimesGreaterThanSpecified();
  }, [slots?.slot]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ScreenHeader title={"Add Appointment"}
          mainStyle={{ height: 50, paddingVertical: 10 }}
          onPress={() => navigation.goBack()}
        />
        {services.length > 0 ? (
          <View style={styles.serviceViewWrapper}>
            <Headline style={styles.appointmentHeadline}>
              Available Services
            </Headline>
            <ScrollView
              contentContainerStyle={styles.serviceContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {services?.map((data, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    setSelectedService(data);
                    setSelectedEndSlot("Invalid date");
                    seterr("");
                  }}
                  style={{
                    borderColor:
                      selectedService.id === data.id
                        ? "#D2AE6A"
                        : "lightgray", backgroundColor:
                      selectedService.id === data.id
                        ? "#D2AE6A"
                        : "white", borderWidth: 2, marginRight: 5, marginLeft: 5, padding: 10, borderRadius: 10
                  }}
                >
                  <View style={styles.singleService}>
                    <View style={styles.serviceImgWrap}>
                       <Image
                      style={{
                        ...styles.serviceImage,
                        borderColor: selectedService.id === data.id ? "#D2AE6A" : "#f2f2f2",
                      }}
                      source={{ uri: data?.image }}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                      </View>
                    <Text style={[styles.serviceText, { maxWidth: 130 }]} numberOfLines={1} ellipsizeMode="tail" >{data?.name}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Headline style={styles.appointmentHeadline}>
            {fetching.service
              ? "Loading...."
              : error?.errors
                ? error.errors
                : "No Service Available"}
          </Headline>
        )}
        {slots?.slot?.length > 0 ? (
          <>
            <View style={styles.timeSlotView}>
              <Text style={styles.appointmentHeadline}>
                Select Start Time
              </Text>
              {lastPageData?.date == dateOnly ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {getSlotUpdateData?.map((data, idx) => (
                    <View
                      key={idx}
                      style={[
                         styles.slotButton,
                        {backgroundColor: selectedSlot.id === idx ? "#D2AE6A" : "white",}
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => hanldeStartTimeSlot(data, idx)}
                      >
                        {data ? (
                          <Text
                            style={[
                              styles.slotText,
                              {
                                color:
                                  selectedSlot.id === idx ? "white" : "black",
                              },
                            ]}
                          >
                            {data}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {slots?.slot?.map((data, idx) => (
                    <View
                      key={idx}
                      style={{
                        ...styles.singleTimeSlot,
                        backgroundColor:
                          selectedSlot.id === idx ? "#D2AE6A" : "white",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => hanldeStartTimeSlot(data, idx)}
                      >
                        {data ? (
                          <Text
                            style={[
                              styles.singleTimeSlotText,
                              {
                                color:
                                  selectedSlot.id === idx ? "white" : "black",
                              },
                            ]}
                          >
                            {data}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
            {selectedEndSlot !== "Invalid date" && (
              <View style={styles.timeSlotView}>
                <Text style={[styles.appointmentHeadline, {marginTop: 0 }]}>
                  End Time{" "}
                </Text>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      ...styles.singleTimeSlot,
                      margin: 0,
                      padding: 0,
                      backgroundColor: "#D2AE6A", // You can change this if you want to match start-time style
                    }}
                  >
                    <TouchableOpacity
                      style={
                        Platform.OS === "ios"
                          ? {
                            padding: 5,
                            flexGrow: 1,
                          }
                          : {
                            backgroundColor: "#D2AE6A",
                            padding: 2,
                            flexGrow: 1,
                            color: "white",
                          }
                      }
                    >
                      <Text
                        style={[
                          styles.singleTimeSlotText,
                          { color: "white" },
                        ]}
                      >
                        {moment(selectedEndSlot, "h:mm a").format("h:mm A")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

          </>
        ) : (
            <View style={[styles.alertBox, {marginHorizontal: 16 }]}>
            <Ionicons name="alert-circle-outline" size={25} style={styles.alertIcon} />
            <Text>{fetching.slot
              ? "Please Select a Service"
              : getSlotUpdateData.length == 0 && lastPageData?.date == dateOnly
                ? "Appointment Time Over,Select Another Date "
                : "Staff Is On Leave Or No Slots Available"}</Text>
          </View>
        )}
        <View style={styles.btnContainer}>
          <Button
            icon="chevron-right"
            mode="contained"
            style={[
              styles.nextBtn,
              {
                backgroundColor: "#D2AE6A",
              },
            ]}
            onPress={nextPage}
          >
            <Text style={{ fontSize: 14 * responsive() }}>Select</Text>
          </Button>
          <View style={styles.space}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAppointment);

const styles = StyleSheet.create({
  appointmentHeadline: {
    fontSize: 16 * responsive(),
    marginTop: 5,
    marginBottom:10,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  singleTimeEndSlot: {
    padding: 10,
    color: "#333",
    fontSize: 17 * responsive(),
    borderColor: "#f2f2f2",
  },
  pressable: {
    borderWidth: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  btnContainer: {
    padding: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  nextBtn: {
    width: "auto",
    marginRight: 10,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: isTablet() ? 5 : 0,
  },
  serviceViewWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  serviceContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "red",
  },
  singleService: {
    marginHorizontal: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },

  serviceImgWrap: {
    backgroundColor: "white",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderColor: "#f2f2f2",
    borderWidth: 2,
    borderRadius: 50,
  },
  serviceImage: {
    width: 100,
    height: 100,
  },
  timeSlotView: {
    marginTop: 10,
    paddingHorizontal: 5,
    paddingBottom: 10,
  },

  slots: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  singleTimeSlot: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 2,
    width: isTablet() ? 120 : 80,
    margin: 5,
    alignSelf: "center",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  singleTimeSlotText: {
    color: "black",
    fontSize: 14 * responsive(),
    padding: 5,
    fontWeight: "350",
  },
  space: {
    height: 120,
  },
  serviceText: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 10,
  },
   alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#D2AE6A',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
   alertMessage: {
    color: '#5D4037',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  alertIcon: {
    marginRight: 12,
    color: '#D2AE6A',
    fontSize: 20,
  },
  SlotBox: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingBottom: 80,
    },
    slotButton: {
      width: "30%",
      padding: 6,
      margin: "1.5%",
      backgroundColor: "#ffffff",
      borderRadius: 2,
      justifyContent: "center",
      shadowColor: "#ffedcb",
      borderWidth: 1,
      borderColor: "#D2AE6A",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    slotText: {
      textAlign: "center",
      color: "#000000",
      fontSize: 14 * responsive(),
    },
    slotButtonActive: {
      backgroundColor: "#D2AE6A",
    },
    slotTextActive: {
      color: "white",
    },
});
