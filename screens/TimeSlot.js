import * as React from "react";
import {ActivityIndicator } from 'react-native';
// dependencies
import moment from "moment";
import Spinner from "../helper/Spinner";
import { Ionicons } from "react-native-vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
  PixelRatio,
  TouchableOpacity,
  Platform,
} from "react-native";
// services
import { getStaff, getSlot } from "../service/Staff";
// constants
import configResponse from "../config/constant";
import { AppStateContext } from "../helper/AppStateContaxt";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dimensions } from "react-native";
import { responsive } from "../helper/responsive";
import Feather from "react-native-vector-icons/Feather";
import { color } from "react-native-reanimated";
import { useRef } from "react";
import { isTablet } from "../components/tablet";
import { MyBooking } from "../service/BookingService";
import ScreenHeader from "../components/screenHeader";
function TimeSlot({ navigation, route }) {
  const { location } = React.useContext(AppStateContext);
  const [selectDate, setDateSelect] = React.useState(false);
  const [selectStaff, setStaffSelect] = React.useState(false);
  const [selectActiveStaff, setActiveStaffSelect] = React.useState();
  const [goNext, setgoNext] = React.useState(false);
  const [goNextValue, setgoNextValue] = React.useState(null);
  const [getStaffData, setStaff] = React.useState([]);
  const [getSlotData, setSlot] = React.useState([]);
  const [getSlotUpdateData, setGetSlotUpdateData] = React.useState([]);
  const [staff, setStaffId] = React.useState(null);
  const [selectedSlot, setselectedSlot] = React.useState(null);
  const [selectedArtist, setselectedArtist] = React.useState(null);
  const [modalDatepicke, setModalDatepicke] = React.useState(false);
  const [updatedDate, setupdatedDate] = React.useState(new Date());
  const [clientUpdateAppointment, setClientUpdateAppointment] = React.useState(
    []
  );
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);

  const service = route.params.id;
  const onChangeModal = (selectDate) => {
    const selectedDate = new Date(selectDate.nativeEvent.timestamp);
    console.log(selectedDate, "we are selecting the date from calendor, step 1");
    setModalDatepicke(false);
    setupdatedDate(selectedDate);
    setselectedSlot(null);
    setgoNextValue(null);
    setgoNext(false);
    const data = `location=${location.id}&service_id=${service}&date=${moment(
      selectedDate
    ).format("YYYY-MM-DD")}`;

    getStaff(data)
      .then((response) => {
        if (response?.status == 200) {
          const output = response?.data?.data;
          setStaff(output);
          setDateSelect(true);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };
  function getTimesGreaterThanSpecified() {
    const specifiedMoment = moment(new Date(), "hh:mm A");
    const greaterTimes = [];
    if (getSlotData.length > 0 && getSlotData) {
      for (const timeString of getSlotData) {
        const time = moment(timeString, "hh:mm A");
        if (time.isAfter(specifiedMoment)) {
          greaterTimes.push(timeString); // Add the time to the array if it's greater than the specified time
        }
      }
      setGetSlotUpdateData(() => greaterTimes);
    }
  }
  function loadData() {
    const data = { action: "all" };
    MyBooking(data)
      .then((response) => {
        // setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data;

          const filteredData = output.filter(
            (item) => item.status === "pending"
          );

          setClientUpdateAppointment(filteredData);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }
  React.useEffect(() => {
    loadData();
  }, []);
  function FindStaff() {
    const itemData = [];

    for (const [key, value] of Object.entries(getStaffData)) {
      const image = { uri: value["profile"] };
      itemData.push(
        <Pressable
          key={value["id"]}
          style={[
            styles.staff,
            selectedArtist == value["id"] ? styles.staffActive : "",
          ]}
          onPressIn={() => {
            PressStaff(value["id"]);
          }}
        >
          <Image resizeMode="cover" style={styles.imgPic} source={image} />
          <Text style={styles.bottomText}>{value["name"]}</Text>
        </Pressable>
      );
    }
    if (itemData.length < 1) {
      configResponse.errorMSG("No specialist available");
      itemData.push(<Text key={1}>No specialist available</Text>);
    }
    return itemData;
  }
  function PressStaff(id) {
    setStaffId(id);
    setselectedArtist(id);
    const data = {
      staff_id: id,
      service_id: service,
      date: moment(updatedDate).format("YYYY-MM-DD"),
    };

    getSlot(data)
      .then((response) => {
        if (response?.status == 200) {
          const output = response?.data;
          setSlot(output);
          setStaffSelect(true);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }
  const checkDate = (date) => {
    const parsedDate = moment(date, "MMM DD, YYYY");

    const formattedDate = parsedDate.format("YYYY-MM-DD");
    return formattedDate;
  };
  function FindSlot(id) {
    const itemData = [];
    if (
      moment(new Date()).format("DD MMMM") === moment(updatedDate).format("DD MMMM")) {
      for (let key = 0; key < getSlotUpdateData.length; key++) {
        const slotTime = getSlotUpdateData[key];
        console.log(slotTime);
        const parsedNewDatetime = moment(updatedDate);
        const formattedNewDate = parsedNewDatetime.format("YYYY-MM-DD");
        const isSlotAvailable = clientUpdateAppointment.every(
          (item) =>
            item.start_time > slotTime ||
            item.end_time < slotTime ||
            formattedNewDate !== checkDate(item.date)
        );
        if (isSlotAvailable) {
          itemData.push(
            <Pressable
              key={key}
              onPressIn={() => {
                pressSlot(slotTime);
              }}
              style={[
                styles.slotButton,
                selectedSlot === slotTime ? styles.slotButtonActive : "",
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedSlot === slotTime ? styles.slotTextActive : "",
                ]}
              >
                {slotTime}
              </Text>
            </Pressable>
          );
        }
      }
      if (itemData.length < 1) {
        configResponse.errorMSG("No slot available");
        itemData.push(<View key={1} style={styles.alertBox}>
          <Ionicons name="alert-circle-outline" size={25} style={styles.alertIcon} />
          <Text style={styles.alertMessage}>No slot available</Text>
        </View>);
      }
    } else {
      for (let key = 0; key < getSlotData.length; key++) {
        const slotTime = getSlotData[key];
        const parsedNewDatetime = moment(updatedDate);
        const formattedNewDate = parsedNewDatetime.format("YYYY-MM-DD");
        const isSlotAvailable = clientUpdateAppointment.every(
          (item) =>
            item.start_time > slotTime ||
            item.end_time < slotTime ||
            formattedNewDate !== checkDate(item.date)
        );
        if (isSlotAvailable) {
          itemData.push(
            <Pressable
              key={key}
              onPressIn={() => {
                pressSlot(slotTime);
              }}
              style={[
                styles.slotButton,
                selectedSlot === slotTime ? styles.slotButtonActive : "",
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedSlot === slotTime ? styles.slotTextActive : "",
                ]}
              >
                {slotTime}
              </Text>
            </Pressable>
          );
        }
      }
      if (itemData.length < 1) {
        configResponse.errorMSG("No slot available");
        itemData.push(<View key={1} style={styles.alertBox}>
          <Ionicons
            name="alert-circle-outline"
            size={25}
            style={styles.alertIcon}
          />
          <Text style={styles.alertMessage}>No slot available</Text>
        </View>);
      }
    }
    return itemData;
  }
  function pressSlot(slot) {
    setselectedSlot(slot);
    const data = {
      service_id: service,
      date: moment(updatedDate).format("YYYY-MM-DD"),
      staff_id: staff,
      start_time: slot,
    };

    setgoNextValue(data);
    setgoNext(true);
  }
  function getUpcomingDatesOfCurrentMonth() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const upcomingDates = [];
    for (let day = currentDay; day <= daysInMonth; day++) {
      upcomingDates.push(new Date(currentYear, currentMonth, day));
    }
    return upcomingDates;
  }
  React.useEffect(() => {
    const data = `location=${location.id}&service_id=${service}&date=${moment(
      updatedDate
    ).format("YYYY-MM-DD")}`;
    selectActiveStaff && PressStaff(selectActiveStaff);
    getStaff(data)
      .then((response) => {
        if (response?.status == 200) {
          const output = response?.data?.data;
          setStaff(output);
          setDateSelect(true);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }, [updatedDate, service, location, selectActiveStaff]);
  const upcomingDates = getUpcomingDatesOfCurrentMonth();
  const formattedDates = upcomingDates.map((date) =>
    date.toLocaleDateString("en-US")
  );

  const selectDateFunction = async (item) => {
    setIsLoadingSlots(true); // Start loading
    try {
      const selectedDate = moment(item, "M/D/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
      console.log("Date Check - Step 3", selectedDate);
      setupdatedDate(selectedDate);
      setselectedSlot(null);
      setgoNextValue(null);
      setgoNext(false);
      // Small delay to ensure smooth UI transition
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsLoadingSlots(false); // Stop loading
    }
  };
  const getRescheduleAppointment = () => { };
  // Find the index of the selected date
  React.useEffect(() => {
    getTimesGreaterThanSpecified();
  }, [getSlotData]);
  const checkTablet = isTablet();
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader style={styles.TopHeadline} title={"Date & Time"} onPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.MasterScroll}
        contentContainerStyle={styles.scrollStyle}
      >
        <View style={styles.MasterView}>
          {selectDate ? (
            <View>
              {getStaffData.length == 0 ? (
                <Text style={[styles.commonHeading, styles.spacing]}>No Specialist Available</Text>
              ) : (
                <Text style={[styles.commonHeading, styles.spacing]}>Select Specialist</Text>
              )}
              {
                <FlatList
                  horizontal
                  style={{ marginBottom: 10 }}
                  data={getStaffData}
                  renderItem={({ item }) => (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.staff,
                        selectedArtist == item.id ? styles.staffActive : "",
                        ,
                      ]}
                      onPressIn={() => {
                        setActiveStaffSelect(item.id);
                      }}
                    >
                      <Image
                        resizeMode="cover"
                        style={styles.imgPic}
                        source={{ uri: item.profile }}
                      />
                      <Text
                        style={[
                          styles.bottomText,
                          selectedArtist == item.id ? { color: "white" } : { color: "black" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.name}
                  showsHorizontalScrollIndicator={false}
                />
              }
            </View>
          ) : (
            <Spinner />
          )}
          {selectStaff ? (
            <View>
              <View style={[styles.spacing, styles.dateHeadingWrapper]}>
                <Text style={[styles.commonHeading]}>
                  Select Date
                </Text>
                <View style={[styles.dateContainer]}>
                  <Pressable
                    onPress={() => setModalDatepicke(!modalDatepicke)}
                    style={styles.datepicker} >
                    <Feather name="calendar" size={23} color={"#A58549"} />
                  </Pressable>
                  {modalDatepicke && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={updatedDate ? new Date(updatedDate) : new Date()}
                      mode={"date"}
                      is24Hour={true}
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={onChangeModal}
                      // onChange={SelectDate}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
              </View>
              <FlatList
                data={formattedDates}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 5, paddingRight: 10 }}
                renderItem={({ item }) => (
                  <View style={{ paddingBottom: 15 }}>
                    <TouchableOpacity
                      style={{
                        width: 60,
                        marginRight: 5,
                        marginLeft: 5,
                        backgroundColor:
                          moment(updatedDate).format("DD MMMM") ===
                            moment(item, "M/D/YYYY").format("DD MMMM")
                            ? "#D2AE6A"
                            : "white",
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#D2AE6A",
                        borderRadius: 8,
                      }}
                      onPress={() => {
                        selectDateFunction(item), setselectedSlot(null);
                        setgoNextValue(null);
                        setgoNext(false);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color:
                            moment(updatedDate).format("DD MMMM") ==
                              moment(item, "M/D/YYYY").format("DD MMMM")
                              ? "white"
                              : "black",
                        }}
                      >
                        {moment(item, "M/D/YYYY").format("MMM")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: "600",
                          // marginTop: -3,
                          color:
                            moment(updatedDate).format("DD MMMM") ==
                              moment(item, "M/D/YYYY").format("DD MMMM")
                              ? "white"
                              : "black",
                        }}
                      >
                        {moment(item, "M/D/YYYY").format("DD")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : null}
          {selectStaff ? (
            <View>
              <View style={[styles.spacing, styles.dateHeadingWrapper]}>
                <Text style={[styles.commonHeading, styles.spacing]}>Available Slots</Text>
                {goNext ? (
                  <View style={styles.nextButtonView}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate("Booking", { goNextValue });
                      }}
                      style={styles.nextButton}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                    </Pressable>
                  </View>
                ) : (
                  <>
                  </>
                )}
              </View>
              <View style={{ height: 230 }}>
                <ScrollView
                  contentContainerStyle={[
                    styles.SlotBox,
                    isLoadingSlots && {
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1 
                    }
                  ]}
                >
                  {isLoadingSlots ? (
                    <ActivityIndicator size="large" color="#D2AE6A" />
                  ) : (
                    <FindSlot />
                  )}
                </ScrollView>
              </View>
            </View>
          ) : (
            <View style={styles.alertBox}>
              <Ionicons
                name="alert-circle-outline"
                size={25}
                color="red"
                style={styles.alertIcon}
              />
              <Text style={styles.alertMessage}>
                Please select a specialist before choosing a time slot.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TimeSlot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  TopHeadline: {
    fontSize: 16 * responsive(),
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  dateHeadingWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 10,
  },
  dateContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  datepicker: {
    color: "#A58549",
  },
  dateText: {
    textAlign: "center",
    fontSize: 14 * responsive(),
    fontWeight: "bold",
  },
  MasterScroll: {
    paddingBottom: 40,
  },
  MasterView: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 30,
  },
  staff: {
    width: isTablet() ? 180 : 120,
    marginRight: 10,
    borderRadius: 2,
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#ffedcb",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 3.18,
    shadowRadius: 1.0,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#D2AE6A"
  },
  imgPic: {
    width: 80 * responsive(),
    height: 80 * responsive(),
    borderRadius: 50,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: "#D2AE6A"
  },
  title: {
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#000000",
    marginTop: 15,
    marginLeft: 5,
    marginBottom: 15,
    fontWeight: "500",
    width: "100%",
  },
  commonHeading: { fontSize: 18.8, fontWeight: "700" },
  spacing: {
    marginBottom: 10,
  },
  bottomText: {
    fontSize: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "black",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",
    width: "100%",
    textAlign: "center"
  },
  staffActive: {
    backgroundColor: "#D2AE6A",
  },
  scrollStyle: {
    height: "auto",
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
    fontFamily: configResponse.fontFamily,
  },
  slotButtonActive: {
    backgroundColor: "#D2AE6A",
  },
  slotTextActive: {
    color: "white",
  },
  CalenderStyle: {
    backgroundColor: configResponse.primaryBackground,
    padding: 10,
    height: 120,
    width: "100%",
    paddingBottom: 20,
  },
  HeaderStyle: {
    fontFamily: configResponse.fontFamily,
    fontWeight: "500",
    color: "#ffffff",
    fontSize: 16 * responsive(),
    marginBottom: 15,
  },
  NameStyle: {
    fontFamily: configResponse.fontFamily,
    fontSize: 13 * responsive(),
    color: "#ffffff",
  },
  NumberStyle: {
    fontFamily: configResponse.fontFamily,
    fontSize: 14 * responsive(),
    color: "#ffffff",
  },
  horizontalScroll: {
    height: "auto",
    width: "100%",
    flexDirection: "column",
    borderWidth: 1,
  },
  normalColor: {
    color: "#ffffff",
    fontFamily: configResponse.fontFamily,
    fontSize: 14 * responsive(),
  },
  highlightDateNumberContainer: {
    backgroundColor: configResponse.primaryBackground,
    color: "#000",
  },
  highlightColor: {
    backgroundColor: configResponse.primaryBackground,
    color: "#fff",
  },
  nextButtonView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    zIndex: 1,
  },
  nextButton: {
    backgroundColor: "#D2AE6A",
    paddingHorizontal: 25,
    width: "auto",
    paddingVertical: 5,
    borderRadius: 40,
    marginHorizontal: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  nextButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    fontWeight: "700",
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
    width: "100%"
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
});
