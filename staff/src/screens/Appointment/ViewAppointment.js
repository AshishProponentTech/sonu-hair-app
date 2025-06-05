import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
  Linking,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../actions";
import { AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FAB, Headline, Portal } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import {
  getAppointment,
  getAppointmentCount,
  loadAppointment,
} from "../../actions/appoinmentsActions";
import DateTimePicker from "@react-native-community/datetimepicker";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { FlatList } from "react-native-gesture-handler";
import { responsive } from "../../../../helper/responsive";
import { getStaffs } from "../../actions/appDataActions";
import Button from "../../../../components/button";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
// import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { getSlots } from "../../actions/appDataActions";
import Toast from "react-native-root-toast";
import axios from "axios";
import SModal from "react-native-modal";
import { baseURL } from "../../constants/index";
import configResponse from "../../../../config/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAPP } from "../../services/authServices";

var moment = require("moment");

function ViewAppointment(props) {
  const dispatch = useDispatch();
  const { appointment } = useSelector((state) => state.AppointmentReducer);
  const { token, user } = useSelector((state) => state.Auth);
  const { staffs } = useSelector((state) => state.AppData);
  const [fetching, setFetching] = useState({ slot: true, service: true });

  const { slots, testSlots } = useSelector((state) => state.AppData);
  const isFocused = useIsFocused();
  const [staffWithApponintments, setStaffWithApponintments] = useState([]);
  const [showAppointment, setShowAppointment] = useState([]);
  const [showFilteredAppointment, setShowFilteredAppointment] = useState([]);
  const [showUpdatedSortedAppointment, setShowUpdateSortedAppointment] =
    useState([]);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalCancelVisible, setModalCancelVisible] = useState(false);
  const [selected, setSelected] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [seletedService, setSelectedService] = useState({});
  const [staffData, setStaffData] = useState({});
  const [serviceData, setServiceData] = useState([]);
  const [updatedDate, setupdatedDate] = useState(new Date());
  const [appointmentStart, setAppointmentStart] = useState("");
  const [appointmentEnd, setAppointmentEnd] = useState("");
  const [selectAppointment, setSelectAppointment] = useState("");
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [time, setSelectTime] = useState("");
  const [getSlotUpdateData, setGetSlotUpdateData] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const toggleModal = (data) => {
    setUpdateData(data);
    setSelectedService(data);
    setStaffData(data?.staff);
    setServiceData(data?.service);
    setAppointmentStart(data?.start_time);
    setAppointmentEnd(data?.end_time);
    setStatus(data?.status);
    setRemark(data?.remark);
    setupdatedDate(moment(data?.date).toDate());
    setSelected(data?.date);
    dispatch(
      getSlots(
        token,
        moment(data?.date).format("Y-M-D"),
        data?.service[0]?.duration,
        data?.staff.id
      )
    );
  };

  const toggleUpdateModal = (date) => {
    setSelectedService(updateData);
    setStaffData(updateData?.staff);
    setServiceData(updateData?.service);
    setAppointmentStart(updateData?.start_time);
    setAppointmentEnd(updateData?.end_time);
    setStatus(updateData?.status);
    setRemark(updateData?.remark);
    setupdatedDate(moment(date).toDate());
    dispatch(
      getSlots(
        token,
        moment(date).format("Y-M-D"),
        updateData?.service[0]?.duration,
        updateData?.staff.id,
        setFetching
      )
    );
  };
  const toggleModalCancel = (data, status) => {
    setSelectedService(data);
    setStaffData(data?.staff);
    setServiceData(data?.service);
    setAppointmentStart(data?.start_time);
    setAppointmentEnd(data?.end_time);
    setStatus(status);

    setupdatedDate(moment(data?.date).toDate());
    dispatch(
      getSlots(
        token,
        moment(data?.date).format("Y-M-D"),
        data?.service[0]?.duration,
        data?.staff.id
      )
    );
  };
  const dateOnly = moment(new Date()).format("YYYY-MM-DD");
  const [fabOpen, setFabOpen] = useState(false);
  const _onStateChange = () => setFabOpen(!fabOpen);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  useEffect(() => {
    if (token !== null) {
      dispatch(getAppointment(token, moment(date).format("Y-MM-DD")));
    }
  }, [date, isFocused]);

  useEffect(() => {
    if (appointment && appointment.data) {
      const filteredData = appointment.data.filter(
        (a) => a.date === moment(date).format("Y-MM-DD")
      );

      const sortedData = filteredData?.sort(
        (a, b) =>
          moment(a.start_time, "hh:mm a") > moment(b.start_time, "hh:mm a")
      );
      const updateSortedAppointment = appointment.data?.sort((a, b) => {
        // Convert start_time strings to Moment objects
        const timeA = moment(a.start_time, "hh:mm A");
        const timeB = moment(b.start_time, "hh:mm A");

        // Compare the Moment objects
        if (timeA.isBefore(timeB)) return -1;
        if (timeA.isAfter(timeB)) return 1;
        return 0;
      });
      setShowUpdateSortedAppointment(() => updateSortedAppointment);
      setShowAppointment(sortedData);
    } else {
      setShowUpdateSortedAppointment(() => []);
      setStaffWithApponintments(() => []);
    }
  }, [appointment, date]);
  useEffect(() => {
    if (appointment && appointment.data) {
      const filteredArray = staffs?.filter((obj1) =>
        showAppointment.some((obj2) => obj2.staff.id === obj1.id)
      );
      setStaffWithApponintments(filteredArray);
    } else {
      setStaffWithApponintments([]);
    }
  }, [showAppointment, staffs, appointment]);

  useEffect(() => {
    if (!selectedStaff.id) return setShowFilteredAppointment(showAppointment);
    const filteredAppointments = showAppointment.filter(
      (ele) => ele.staff.id == selectedStaff.id
    );
    setShowFilteredAppointment(filteredAppointments);
  }, [selectedStaff, showAppointment, staffs]);

  const getAllStaff = (userToken, currentDate) => {
    dispatch(getStaffs(userToken, currentDate));
  };

  useEffect(() => {
    getAllStaff(token, date);
  }, [date]);
  useEffect(() => {
    if (Object.keys(seletedService).length !== 0) {
      const startTime = moment(appointmentStart, "h:mm a").format("h:mm A");
      let endTime = startTime;
      const serviceTime = seletedService?.service[0].duration;
      endTime = moment(endTime, "hh:mm A")
        .add(serviceTime, "minutes")
        .format("h:mm A");
      setAppointmentEnd(endTime);
    }
  }, [seletedService, appointmentStart]);
  const handleUpdate = () => {
    const appointmentData = {
      id: seletedService.appoinment
        ? seletedService.appoinment
        : selectedStaff.id,
      status: status,
      remark: remark,
      start_time: appointmentStart,
      end_time: appointmentEnd,
      date:
        status == "cancelled" ? moment(updatedDate).format("Y-M-D") : selected,
    };
    if (status === "cancelled" && remark === "") {
      configResponse.modalErrorMSG("Cancelled");
    } else {
      updateAppointments(token, appointmentData);

      setRemark("");
    }
  };
  const updateAppointments = async (userToken, appointmentData) => {
    try {
      const config = {
        method: "patch",
        url: `${baseURL}/staff/appointment`,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${userToken}`,
          Connection: `keep-alive`,
        },
        data: appointmentData,
      };

      const { data } = await axios(config);

      if (await data.status) {
        dispatch(getAppointment(token, moment(date).format("Y-M-D")));
        // dispatch(getAppointmentCount(token));
        setModalVisible(false);
        setModalCancelVisible(false);

        Toast.show("Updated successfully!", {});
      }
    } catch (error) {
      Toast.show("Server Error", {
        duration: Toast.durations.LONG,
      });
      // console.log(error);
    }
  };
  function getTimesGreaterThanSpecified() {
    const specifiedMoment = moment(new Date(), "hh:mm A");
    const greaterTimes = [];
    if (slots?.slot?.length > 0 && slots?.slot) {
      for (const timeString of slots?.slot) {
        const time = moment(timeString, "hh:mm A");
        if (time.isAfter(specifiedMoment)) {
          greaterTimes.push(timeString); // Add the time to the array if it's greater than the specified time
        }
      }
      setGetSlotUpdateData(() => greaterTimes);
    }
  }

  useEffect(() => {
    if (token !== null) {
      dispatch(getAppointment(token, moment(date).format("Y-M-D")));
    }
  }, [date]);

  useEffect(() => {
    if (slots.slot) {
      slots.slot.push(appointmentStart);
    }
  }, [slots]);
  React.useEffect(() => {
    getTimesGreaterThanSpecified();
  }, [slots?.slot]);
  // const showModalMessage = () => {
  //   if (status === "cancelled" && remark === "") {
  //     // Clear any existing timeout and set showMessage to false

  //     setShowMessage(() => true);

  //     // Set a new timeout
  //     setTimeout(() => {
  //       setShowMessage(() => false);
  //     }, 2000);
  //   }
  //   return;
  // };
  const showModalMessage = (status) => {
    if (status === "cancelled" && remark === "") {
      // Clear any existing timeout and set showMessage to false
      setShowMessage(() => true);
    }
  };

  // Use useEffect to handle the timeout logic
  useEffect(() => {
    if (showMessage) {
      const timeout = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      // Clear the timeout when the component unmounts or when showMessage changes
      return () => clearTimeout(timeout);
    }
  }, [showMessage]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        {/* {isFocused && (
          <Portal>
            <FAB.Group
              open={fabOpen}
              visible={true}
              style={styles.fabGroup}
              fabStyle={[
                { backgroundColor: props.color.secondaryColor },
                styles.addBtnContainer,
              ]}
              icon={fabOpen ? "calendar-today" : "plus"}
              actions={
                user.role === 3
                  ? [
                      {
                        icon: "calendar-remove",
                        label: "Add Holiday",
                        onPress: () => {
                          props.navigation.navigate("Appointment", {
                            screen: "AddUnavailability",
                          });
                        },
                      },
                      {
                        icon: "calendar-edit",
                        label: "Update Appointment",
                        onPress: () => {
                          props.navigation.navigate("Appointment", {
                            screen: "UpdateAppointment",
                          });
                        },
                      },
                      {
                        icon: "plus",
                        label: "Add Appointment",
                        onPress: () => {
                          props.navigation.navigate("Book", {
                            screen: "AddAppointment",
                          });
                        },
                      },
                    ]
                  : [
                      {
                        icon: "plus",
                        label: "Add Appointment",
                        onPress: () => {
                          props.navigation.navigate("Book", {
                            screen: "AddAppointment",
                          });
                        },
                      },
                      {
                        icon: "calendar-edit",
                        label: "Update Appointment",
                        onPress: () => {
                          props.navigation.navigate("Appointment", {
                            screen: "UpdateAppointment",
                          });
                        },
                      },
                    ]
              }
              onStateChange={_onStateChange}
              onPress={() => {
                if (fabOpen) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        )} */}
        <View style={[styles.datePickerContainer, { flexDirection: "column" }]}>
          <Pressable onPress={() => setShow(!show)} style={[styles.datepicker]}>
            <AntDesign
              name="calendar"
              color={"white"}
              style={{ marginRight: 10 }}
              size={20}
            />
            <Text style={[styles.dateText, { color: "white" }]}>
              {moment(date).format("DD MMM YYYY")}
            </Text>
          </Pressable>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              minimumDate={new Date(moment.now())}
            />
          )}
        </View>

        {staffWithApponintments && staffWithApponintments?.length > 0 && (
          <View style={styles.staffViewWrapper}>
            <Headline style={[styles.appointmentHeadline]}>
              Staff With Appointments
            </Headline>
            <ScrollView
              contentContainerStyle={styles.staffContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <Pressable key={"idx"} onPress={() => setSelectedStaff([])}>
                <View
                  style={[
                    styles.singleStaffWrapper,
                    {
                      borderColor: !selectedStaff.id
                        ? "#D2AE6A"
                        : "lightgray",
                      borderWidth: !selectedStaff.id ? 1 : 1,
                      backgroundColor: !selectedStaff.id  ? "#d2ae6aa6" : "white",
                    },
                  ]}
                >
                  <Image
                    style={styles.staffImage}
                    source={{
                      uri: "https://api.sonuhaircut.com/uploads/logo-dark.png",
                    }}
                  />

                  <Text style={styles.staffText}>View All </Text>
                </View>
              </Pressable>
              {staffWithApponintments?.map((data, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    setSelectedStaff(data);
                  }}
                >
                  <View
                    style={[
                      styles.singleStaffWrapper,
                      {
                        borderColor:
                          selectedStaff.id === data.id
                            ? "#D2AE6A"
                            : "lightgray",
                        borderWidth: selectedStaff.id === data.id ? 1 : 1,
                        backgroundColor: selectedStaff.id  === data.id  ? "#d2ae6aa6" : "white",
                      },
                    ]}
                  >
                    <Image
                      style={styles.staffImage}
                      source={{ uri: data.pic }}
                    />
                    <Text style={styles.staffText}>{data.name}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View
          style={{
            ...styles.datePickerContainer,
            marginTop: 20,
          }}
        ></View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "white",
              flex: 1,

              paddingVertical: 10,
            }}
          >
            {Object.keys(selectedStaff).length > 0 ? (
              showUpdatedSortedAppointment?.map((data) =>
                selectedStaff.id === data.staff.id ? (
                  <View>
                    <View
                      style={{
                        alignSelf: "center",
                        paddingBottom: 40,
                        width: "90%",
                      }}
                    >
                      <Pressable
                        style={{
                          width: "100%",
                          backgroundColor: "#fff",
                          borderRadius: 15,
                          borderWidth: 2,
                          borderColor: "#D2AE6A",
                        }}
                        onPress={() =>
                          setSelectAppointment(() => data.appoinment)
                        }
                      >
                        <View style={styles.singleAgenda}>
                          <View>
                            <Image
                              source={{ uri: data.service[0].img }}
                              style={styles.agendaImage}
                              resizeMode="contain"
                            />
                          </View>
                          <View style={{ paddingLeft: 20, flex: 1 }}>
                            <View
                              style={{ position: "relative", paddingRight: 30 }}
                            >
                              <Text
                                style={styles.serviceTag}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {data.service[0].name}
                              </Text>

                              <TouchableOpacity
                                style={styles.callButton}
                                onPress={() =>
                                  Linking.openURL(`tel:${data.client.phone}`)
                                }
                              >
                                <Feather
                                  name="phone-call"
                                  size={16}
                                  color={"#fff"}
                                />
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                borderTopWidth: 1,
                                borderColor: "#D2AE6A",
                                paddingTop: 10,
                                marginTop: 10,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingBottom: 10,
                                }}
                              >
                                <FontAwesome name="user-o" size={15} />
                                <Text style={styles.agendaName}>
                                  {" "}
                                  {data.client.name}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingBottom: 10,
                                }}
                              >
                                <Feather name="calendar" size={16} />
                                <Text style={styles.agendaTime}>
                                  {" "}
                                  {moment(data.date).format("DD")}{" "}
                                  {moment(data.date).format("MMMM")},{" "}
                                  {data.start_time} - {data.end_time}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingBottom: 10,
                                }}
                              >
                                <Ionicons name="call" size={16} />
                                <Text style={styles.agendaServices}>
                                  {" "}
                                  {data.client.phone}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        {selectAppointment === data.appoinment ? (
                          <View
                            style={{
                              paddingHorizontal: 15,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderTopWidth: 1,
                              borderColor: "#e5cb9b",
                            }}
                          >
                            <Button
                              title="Cancel"
                              onPress={() => {
                                toggleModalCancel(data);
                                setStatus("cancelled");
                                setModalCancelVisible(!isModalCancelVisible);
                              }}
                              buttonStyle={{
                                marginVertical: 10,
                                width: "45%",
                                paddingVertical: 5,
                                backgroundColor: "#e13945",
                              }}
                              buttonTextStyle={{ fontSize: 15 }}
                            />
                            <Button
                              title="Update"
                              onPress={() => {
                                setModalVisible(!isModalVisible);
                                toggleModal(data);
                              }}
                              buttonStyle={{
                                marginVertical: 10,
                                width: "45%",
                                paddingVertical: 5,
                                backgroundColor: "#a0a2ad",
                              }}
                              buttonTextStyle={{ fontSize: 15 , color: "white" }}
                            />
                          </View>
                        ) : null}
                      </Pressable>
                      <View style={{ flex: 1, backgroundColor: "white" }}>
                        <Modal
                          visible={isModalVisible}
                          style={{ justifyContent: "flex-end", margin: 0 }}
                        >
                          <SafeAreaView>
                            <ScrollView showsVerticalScrollIndicator={false}>
                              <View
                                style={{
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                  backgroundColor: "white",
                                  paddingHorizontal: 10,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 10,
                                    marginBottom: 15,
                                    marginHorizontal: 10,
                                  }}
                                >
                                  <TouchableOpacity
                                    style={{
                                      //position: "absolute",
                                      left: 0,
                                      //borderWidth: 1,
                                      top: 0,
                                      padding: 10,
                                    }}
                                    onPress={() => {
                                      setModalVisible(!isModalVisible);
                                    }}
                                  >
                                    <Feather
                                      name="chevron-left"
                                      size={25}
                                      onPress={() => {
                                        setModalVisible(!isModalVisible);
                                      }}
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    style={{
                                      fontSize: 22,
                                      fontWeight: "800",
                                      marginLeft: -15,
                                      textAlign: "center",
                                      width: "100%",
                                    }}
                                  >
                                    Update Appointment
                                  </Text>
                                </View>
                                <ScrollView
                                  showsVerticalScrollIndicator={false}
                                >
                                  <Calendar
                                    maxDate={moment()
                                      .add(1, "months")
                                      .endOf("month")
                                      .format("YYYY-MM-DD")}
                                    onDayPress={(day) => {
                                      setSelected(() => day.dateString);

                                      toggleUpdateModal(day.dateString);
                                    }}
                                    markedDates={{
                                      [selected]: {
                                        selected: true,
                                        disableTouchEvent: true,
                                        selectedDotColor: "orange",
                                      },
                                    }}
                                    theme={{
                                      backgroundColor: "#ffffff",
                                      calendarBackground: "#ffffff",
                                      textSectionTitleColor: "#b6c1cd",
                                      textSectionTitleDisabledColor: "#d9e1e8",
                                      // selectedDayBackgroundColor: props.color.primaryColor,
                                      selectedDayBackgroundColor: "#D2AE6A",
                                      selectedDayTextColor: "#ffffff",
                                      //todayTextColor: props.color.primaryColor,
                                      todayTextColor: "#D2AE6A",
                                      dayTextColor: "#2d4150",
                                      textDisabledColor: "#d9e1e8",
                                      dotColor: "#00adf5",
                                      selectedDotColor: "#ffffff",
                                      arrowColor: "orange",
                                      disabledArrowColor: "#d9e1e8",

                                      monthTextColor: "#D2AE6A",

                                      indicatorColor: "#D2AE6A",
                                      textDayFontWeight: "300",
                                      textMonthFontWeight: "bold",
                                      textDayHeaderFontWeight: "300",
                                      textDayFontSize: 16 * responsive(),
                                      textMonthFontSize: 16 * responsive(),
                                      textDayHeaderFontSize: 16 * responsive(),
                                    }}
                                    minDate={moment(new Date()).format(
                                      "YYYY-MM-DD"
                                    )}
                                  />
                                  <View>
                                    <Text
                                      style={{
                                        alignSelf: "center",
                                        marginTop: 10,
                                        fontSize: 18,
                                        fontWeight: "600",
                                      }}
                                    >
                                      Select Status
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItem: "center",
                                      marginVertical: 10,
                                      justifyContent: "space-between",
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                    }}
                                  >
                                    <View
                                      style={{
                                        backgroundColor:
                                          status == "pending"
                                            ? "#D2AE6A"
                                            : "#D9D9D9",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        width: 100,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.Headingtitle,
                                          {
                                            color:
                                              status == "pending"
                                                ? "white"
                                                : "black",
                                          },
                                        ]}
                                        key="title1"
                                        onPress={() => setStatus("pending")}
                                      >
                                        Pending
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        backgroundColor:
                                          status == "complete"
                                            ? "#D2AE6A"
                                            : "#D9D9D9",
                                        width: 100,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                        alignSelf: "center",
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.Headingtitle,
                                          {
                                            color:
                                              status == "complete"
                                                ? "white"
                                                : "black",
                                          },
                                        ]}
                                        key="title2"
                                        onPress={() => setStatus("complete")}
                                      >
                                        Complete
                                      </Text>
                                    </View>

                                    {}
                                    <View
                                      style={{
                                        backgroundColor:
                                          status == "cancelled"
                                            ? "#D2AE6A"
                                            : "#D9D9D9",
                                        width: 100,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.Headingtitle,
                                          {
                                            color:
                                              status == "cancelled"
                                                ? "white"
                                                : "black",
                                          },
                                        ]}
                                        key="title3"
                                        onPress={() => setStatus("cancelled")}
                                      >
                                        Cancel
                                      </Text>
                                    </View>
                                  </View>
                                  <Text
                                    style={{
                                      alignSelf: "center",
                                      marginTop: 10,
                                      fontWeight: "600",
                                      fontSize: 18,
                                    }}
                                  >
                                    {fetching.slot
                                      ? "Select Start Time"
                                      : "No Slots"}
                                  </Text>

                                  {selected == dateOnly ? (
                                    <FlatList
                                      style={{
                                        marginTop: 10,
                                        alignSelf: "center",
                                      }}
                                      data={getSlotUpdateData}
                                      numColumns={4}
                                      renderItem={({ item }) => (
                                        <View
                                          style={{
                                            alignSelf: "center",
                                            justifyContent: "center",

                                            paddingVertical: 10,
                                            paddingHorizontal: 10,
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() =>
                                              setAppointmentStart(item)
                                            }
                                          >
                                            <View
                                              style={{
                                                backgroundColor:
                                                  appointmentStart == item
                                                    ? "#D2AE6A"
                                                    : "white",

                                                elevation: 4,
                                                borderWidth: 1,
                                                borderColor: "#f5f0f0",
                                                //width: 80,
                                                width: "100%",
                                                flexGrow: 1,
                                                alignItems: "center",
                                                paddingVertical: 5,
                                                shadowColor: "#000000",
                                                shadowOffset: {
                                                  width: 0,
                                                  height: 3,
                                                },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 5,

                                                borderRadius: 5,

                                                marginTop: 2,
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontSize: 14,
                                                  fontWeight: "800",
                                                  padding: 4,
                                                  color:
                                                    appointmentStart == item
                                                      ? "white"
                                                      : "black",
                                                }}
                                              >
                                                {item}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    />
                                  ) : fetching.slot ? (
                                    <FlatList
                                      style={{
                                        marginTop: 10,
                                        alignSelf: "center",
                                      }}
                                      data={slots?.slot}
                                      numColumns={4}
                                      renderItem={({ item }) => (
                                        <View
                                          style={{
                                            alignSelf: "center",
                                            justifyContent: "center",

                                            paddingVertical: 10,
                                            paddingHorizontal: 10,
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() =>
                                              setAppointmentStart(item)
                                            }
                                          >
                                            <View
                                              style={{
                                                backgroundColor:
                                                  appointmentStart == item
                                                    ? "#D2AE6A"
                                                    : "white",

                                                elevation: 4,
                                                borderWidth: 1,
                                                borderColor: "#f5f0f0",
                                                width: "100%",
                                                flexGrow: 1,
                                                alignItems: "center",
                                                paddingVertical: 5,
                                                shadowColor: "#000000",
                                                shadowOffset: {
                                                  width: 0,
                                                  height: 3,
                                                },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 5,

                                                borderRadius: 5,

                                                marginTop: 2,
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontSize: 14,
                                                  fontWeight: "800",
                                                  padding: 4,
                                                  color:
                                                    appointmentStart == item
                                                      ? "white"
                                                      : "black",
                                                }}
                                              >
                                                {item}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    />
                                  ) : null}
                                  <View>
                                    <Text
                                      style={{
                                        alignSelf: "center",
                                        marginTop: 10,
                                        fontWeight: "600",
                                        fontSize: 18,
                                      }}
                                    >
                                      End Time
                                    </Text>
                                    <View
                                      style={{
                                        alignSelf: "center",
                                        marginTop: 10,
                                      }}
                                    >
                                      <View
                                        style={{
                                          backgroundColor: "white",

                                          elevation: 4,
                                          borderWidth: 1,
                                          borderColor: "#f5f0f0",
                                          shadowColor: "#000000",
                                          shadowOffset: {
                                            width: 0,
                                            height: 3,
                                          },
                                          shadowOpacity: 0.1,
                                          shadowRadius: 5,
                                          width: 80,
                                          alignItems: "center",
                                          paddingVertical: 5,
                                          borderRadius: 5,
                                          marginLeft: 10,
                                          marginTop: 2,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            color: "black",
                                            padding: 4,
                                          }}
                                        >
                                          {moment(
                                            appointmentEnd,
                                            "h:mm a"
                                          ).format("h:mm A")}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                  <View>
                                    {showMessage && (
                                      <View
                                        style={{
                                          backgroundColor: "black",
                                          marginTop: 10,
                                          borderRadius: 10,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "white",
                                            fontSize: 14,
                                            fontWeight: "600",
                                            padding: 5,
                                            textAlign: "center",
                                          }}
                                        >
                                          Please Add Some Remark For Cancelling
                                          the Appointment
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <View
                                    style={{
                                      backgroundColor: "#D9D9D9",
                                      height: 200,
                                      borderRadius: 10,
                                      padding: 10,
                                      marginHorizontal: 10,
                                      marginTop: 20,
                                    }}
                                  >
                                    <TextInput
                                      scrollEnabled={true}
                                      multiline={true}
                                      placeholder="Any reason to Update the Appointment"
                                      onChangeText={(text) => {
                                        setRemark(text);
                                      }}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      paddingHorizontal: 15,

                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Button
                                      title="Cancel"
                                      onPress={() =>
                                        setModalVisible(!isModalVisible)
                                      }
                                      buttonStyle={{
                                        marginVertical: 10,
                                        width: "45%",
                                        paddingVertical: 5,
                                        backgroundColor: "#e13945",
                                      }}
                                      buttonTextStyle={{ fontSize: 15 }}
                                    />
                                    <Button
                                      title="Update"
                                      onPress={() => {
                                        handleUpdate();
                                        showModalMessage();
                                      }}
                                      buttonStyle={{
                                        marginVertical: 10,
                                        width: "45%",
                                        paddingVertical: 5,
                                      }}
                                      buttonTextStyle={{ fontSize: 15 }}
                                    />
                                  </View>
                                </ScrollView>
                              </View>
                            </ScrollView>
                          </SafeAreaView>
                        </Modal>
                        <SModal isVisible={isModalCancelVisible}>
                          <ScrollView style={{ marginTop: 100 }}>
                            <View
                              style={{
                                height: "100%",
                                backgroundColor: "white",
                                borderRadius: 10,
                                padding: 10,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginBottom: 15,
                                  marginTop: 5,
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() =>
                                    setModalCancelVisible(!isModalCancelVisible)
                                  }
                                >
                                  <Feather name="chevron-left" size={20} />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "600",

                                    textAlign: "center",
                                    marginLeft: 10,
                                  }}
                                >
                                  Are you sure you want to cancel ?
                                </Text>
                              </View>
                              <View>
                                {showMessage && (
                                  <View
                                    style={{
                                      backgroundColor: "black",
                                      marginTop: 10,
                                      borderRadius: 10,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "white",
                                        fontSize: 14,
                                        fontWeight: "600",
                                        padding: 5,
                                        textAlign: "center",
                                      }}
                                    >
                                      Please Add Some Remark For Cancelling the
                                      Appointment
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <View
                                style={{
                                  backgroundColor: "#D9D9D9",
                                  height: 200,
                                  borderRadius: 10,
                                  padding: 10,
                                }}
                              >
                                <TextInput
                                  onChangeText={(text) => setRemark(text)}
                                  scrollEnabled={true}
                                  multiline={true}
                                  placeholder="Please provide the reason to cancel the Appointment"
                                />
                              </View>
                              <View
                                style={{
                                  paddingHorizontal: 15,

                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 20,
                                  justifyContent: "space-between",
                                }}
                              >
                                <Button
                                  title="Back"
                                  onPress={() =>
                                    setModalCancelVisible(!isModalCancelVisible)
                                  }
                                  buttonStyle={{
                                    marginVertical: 10,
                                    width: "45%",
                                    paddingVertical: 5,
                                    backgroundColor: "#e13945",
                                  }}
                                  buttonTextStyle={{ fontSize: 16 }}
                                />
                                <Button
                                  title="Update"
                                  onPress={() => {
                                    handleUpdate(), showModalMessage();
                                  }}
                                  buttonStyle={{
                                    marginVertical: 10,
                                    width: "45%",
                                    paddingVertical: 5,
                                  }}
                                  buttonTextStyle={{ fontSize: 16 }}
                                />
                              </View>
                            </View>
                          </ScrollView>
                        </SModal>
                      </View>
                    </View>
                  </View>
                ) : null
              )
            ) : (
              <FlatList
                data={showUpdatedSortedAppointment}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: "white" }}
                renderItem={({ item: data }) => (
                  <View style={{ flex: 1, backgroundColor: "white" }}>
                    <View
                      style={{
                        alignSelf: "center",
                        paddingBottom: 40,
                        width: "90%",
                      }}
                    >
                      <Pressable
                        style={{
                          width: "100%",
                          backgroundColor: "#fff",
                          borderRadius: 15,
                          borderWidth: 2,
                          borderColor: "#D2AE6A",
                        }}
                        onPress={() =>
                          setSelectAppointment(() => data.appoinment)
                        }
                      >
                        <View style={styles.singleAgenda}>
                          <View>
                            <Image
                              source={{ uri: data.service[0].img }}
                              style={styles.agendaImage}
                            />
                          </View>

                          <View style={{paddingLeft: 20, flex: 1}}>
                            <View
                             style={{ position: "relative", paddingRight: 30 }}
                            >
                              <Text
                                style={styles.serviceTag}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {data.service[0].name}
                              </Text>
                              <TouchableOpacity
                                style={styles.callButton}
                                onPress={() =>
                                  Linking.openURL(`tel:${data.client.phone}`)
                                }
                              >
                                <Feather
                                  name="phone-call"
                                  size={16}
                                  color={"#fff"}
                                />
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{ marginTop: 6 }}
                            >
                              <Text
                               style={[
                                  styles.agendaName,
                                  { fontWeight: "800" },
                                ]}
                              >
                                {data.staff.name}
                              </Text>
                            </View>
                            <View
                             style={{
                                borderTopWidth: 1,
                                borderColor: "#D2AE6A",
                                paddingTop: 10,
                                marginTop: 10,
                              }}
                            >
                              <View
                               style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingBottom: 10,
                                }}
                              >
                                <FontAwesome name="user-o" size={15} />
                                <Text style={styles.agendaName}>
                                  {" "}
                                  {data.client.name}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingBottom: 10,
                                }}
                              >
                                <Feather name="calendar" size={16} />
                                <Text style={styles.agendaTime}>
                                  {" "}
                                  {moment(data.date).format("DD")}{" "}
                                  {moment(data.date).format("MMMM")},{" "}
                                  {data.start_time} - {data.end_time}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingBottom: 10,
                                  marginLeft: -2,
                                }}
                              >
                                <Ionicons name="call" size={16} />
                                <Text style={styles.agendaServices}>
                                  {" "}
                                  {data.client.phone}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        {selectAppointment === data.appoinment ? (
                          <View
                            style={{
                              paddingHorizontal: 15,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                               borderTopWidth: 1,
                              borderColor: "#e5cb9b",
                            }}
                          >
                            <Button
                              title="Cancel"
                              onPress={() => {
                                toggleModalCancel(data);
                                setStatus("cancelled");
                                setModalCancelVisible(!isModalCancelVisible);
                              }}
                              buttonStyle={{
                                marginVertical: 10,
                                width: "45%",
                                paddingVertical: 5,
                                backgroundColor: "#e13945",
                              }}
                              buttonTextStyle={{ fontSize: 15 }}
                            />
                            <Button
                              title="Update"
                              onPress={() => {
                                setModalVisible(!isModalVisible);
                                toggleModal(data);
                              }}
                              buttonStyle={{
                                marginVertical: 10,
                                width: "45%",
                                paddingVertical: 5,
                                backgroundColor: "#a0a2ad",
                              }}
                              buttonTextStyle={{ fontSize: 15, color: "white", }}
                            />
                          </View>
                        ) : null}
                      </Pressable>
                      <View style={{ flex: 1, backgroundColor: "white" }}>
                        <Modal
                          visible={isModalVisible}
                          style={{ justifyContent: "flex-end", margin: 0 }}
                        >
                          <SafeAreaView>
                            <ScrollView showsVerticalScrollIndicator={false}>
                              <View
                                style={{
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                  backgroundColor: "white",
                                  paddingHorizontal: 10,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 10,
                                    marginBottom: 15,
                                    marginHorizontal: 10,
                                  }}
                                >
                                  <TouchableOpacity
                                    style={{
                                      left: 0,
                                      top: 0,
                                      padding: 10,
                                    }}
                                    onPress={() => {
                                      setModalVisible(!isModalVisible);
                                    }}
                                  >
                                    <Feather
                                      name="chevron-left"
                                      size={25}
                                      onPress={() => {
                                        setModalVisible(!isModalVisible);
                                      }}
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    style={{
                                      fontSize: 22,
                                      fontWeight: "800",
                                      marginLeft: -15,
                                      textAlign: "center",
                                      width: "100%",
                                    }}
                                  >
                                    Update Appointment
                                  </Text>
                                </View>
                                <ScrollView
                                  showsVerticalScrollIndicator={false}
                                >
                                  <Calendar
                                    maxDate={moment()
                                      .add(1, "months")
                                      .endOf("month")
                                      .format("YYYY-MM-DD")}
                                    onDayPress={(day) => {
                                      setSelected(() => day.dateString);

                                      toggleUpdateModal(day.dateString);
                                    }}
                                    markedDates={{
                                      [selected]: {
                                        selected: true,
                                        disableTouchEvent: true,
                                        selectedDotColor: "orange",
                                      },
                                    }}
                                    theme={{
                                      backgroundColor: "#ffffff",
                                      calendarBackground: "#ffffff",
                                      textSectionTitleColor: "#b6c1cd",
                                      textSectionTitleDisabledColor: "#d9e1e8",
                                      // selectedDayBackgroundColor: props.color.primaryColor,
                                      selectedDayBackgroundColor: "#D2AE6A",
                                      selectedDayTextColor: "#ffffff",
                                      //todayTextColor: props.color.primaryColor,
                                      todayTextColor: "#D2AE6A",
                                      dayTextColor: "#2d4150",
                                      textDisabledColor: "#d9e1e8",
                                      dotColor: "#00adf5",
                                      selectedDotColor: "#ffffff",
                                      arrowColor: "orange",
                                      disabledArrowColor: "#d9e1e8",

                                      monthTextColor: "#D2AE6A",

                                      indicatorColor: "#D2AE6A",
                                      textDayFontWeight: "300",
                                      textMonthFontWeight: "bold",
                                      textDayHeaderFontWeight: "300",
                                      textDayFontSize: 16 * responsive(),
                                      textMonthFontSize: 16 * responsive(),
                                      textDayHeaderFontSize: 16 * responsive(),
                                    }}
                                    minDate={moment(new Date()).format(
                                      "YYYY-MM-DD"
                                    )}
                                  />
                                  <View>
                                    <Text
                                      style={{
                                        alignSelf: "center",
                                        marginTop: 10,
                                        fontSize: 18,
                                        fontWeight: "600",
                                      }}
                                    >
                                      Select Status
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItem: "center",
                                      marginVertical: 10,
                                      justifyContent: "space-between",
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                    }}
                                  >
                                    <View
                                      style={{
                                        backgroundColor:
                                          status == "pending"
                                            ? "#D2AE6A"
                                            : "#D9D9D9",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        width: 100,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.Headingtitle,
                                          {
                                            color:
                                              status == "pending"
                                                ? "white"
                                                : "black",
                                          },
                                        ]}
                                        key="title1"
                                        onPress={() => setStatus("pending")}
                                      >
                                        Pending
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        backgroundColor:
                                          status == "complete"
                                            ? "#D2AE6A"
                                            : "#D9D9D9",
                                        width: 100,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                        alignSelf: "center",
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.Headingtitle,
                                          {
                                            color:
                                              status == "complete"
                                                ? "white"
                                                : "black",
                                          },
                                        ]}
                                        key="title2"
                                        onPress={() => setStatus("complete")}
                                      >
                                        Complete
                                      </Text>
                                    </View>

                                    {}
                                    <View
                                      style={{
                                        backgroundColor:
                                          status == "cancelled"
                                            ? "#D2AE6A"
                                            : "#D9D9D9",
                                        width: 100,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.Headingtitle,
                                          {
                                            color:
                                              status == "cancelled"
                                                ? "white"
                                                : "black",
                                          },
                                        ]}
                                        key="title3"
                                        onPress={() => setStatus("cancelled")}
                                      >
                                        Cancel
                                      </Text>
                                    </View>
                                  </View>
                                  <Text
                                    style={{
                                      alignSelf: "center",
                                      marginTop: 10,
                                      fontWeight: "600",
                                      fontSize: 18,
                                    }}
                                  >
                                    {fetching.slot
                                      ? "Select Start Time"
                                      : "No Slots"}
                                  </Text>

                                  {selected == dateOnly ? (
                                    <FlatList
                                      style={{
                                        marginTop: 10,
                                        alignSelf: "center",
                                      }}
                                      data={getSlotUpdateData}
                                      numColumns={4}
                                      renderItem={({ item }) => (
                                        <View
                                          style={{
                                            alignSelf: "center",
                                            justifyContent: "center",

                                            paddingVertical: 10,
                                            paddingHorizontal: 10,
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() =>
                                              setAppointmentStart(item)
                                            }
                                          >
                                            <View
                                              style={{
                                                backgroundColor:
                                                  appointmentStart == item
                                                    ? "#D2AE6A"
                                                    : "white",

                                                elevation: 4,
                                                borderWidth: 1,
                                                borderColor: "#f5f0f0",
                                                //width: 80,
                                                width: "100%",
                                                flexGrow: 1,
                                                alignItems: "center",
                                                paddingVertical: 5,
                                                shadowColor: "#000000",
                                                shadowOffset: {
                                                  width: 0,
                                                  height: 3,
                                                },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 5,

                                                borderRadius: 5,

                                                marginTop: 2,
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontSize: 14,
                                                  fontWeight: "800",
                                                  padding: 4,
                                                  color:
                                                    appointmentStart == item
                                                      ? "white"
                                                      : "black",
                                                }}
                                              >
                                                {item}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    />
                                  ) : fetching.slot ? (
                                    <FlatList
                                      style={{
                                        marginTop: 10,
                                        alignSelf: "center",
                                      }}
                                      data={slots?.slot}
                                      numColumns={4}
                                      renderItem={({ item }) => (
                                        <View
                                          style={{
                                            alignSelf: "center",
                                            justifyContent: "center",

                                            paddingVertical: 10,
                                            paddingHorizontal: 10,
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() =>
                                              setAppointmentStart(item)
                                            }
                                          >
                                            <View
                                              style={{
                                                backgroundColor:
                                                  appointmentStart == item
                                                    ? "#D2AE6A"
                                                    : "white",

                                                elevation: 4,
                                                borderWidth: 1,
                                                borderColor: "#f5f0f0",
                                                width: "100%",
                                                flexGrow: 1,
                                                alignItems: "center",
                                                paddingVertical: 5,
                                                shadowColor: "#000000",
                                                shadowOffset: {
                                                  width: 0,
                                                  height: 3,
                                                },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 5,

                                                borderRadius: 5,

                                                marginTop: 2,
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontSize: 14,
                                                  fontWeight: "800",
                                                  padding: 4,
                                                  color:
                                                    appointmentStart == item
                                                      ? "white"
                                                      : "black",
                                                }}
                                              >
                                                {item}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    />
                                  ) : null}
                                  <View>
                                    <Text
                                      style={{
                                        alignSelf: "center",
                                        marginTop: 10,
                                        fontWeight: "600",
                                        fontSize: 18,
                                      }}
                                    >
                                      End Time
                                    </Text>
                                    <View
                                      style={{
                                        alignSelf: "center",
                                        marginTop: 10,
                                      }}
                                    >
                                      <View
                                        style={{
                                          backgroundColor: "white",

                                          elevation: 4,
                                          borderWidth: 1,
                                          borderColor: "#f5f0f0",
                                          shadowColor: "#000000",
                                          shadowOffset: {
                                            width: 0,
                                            height: 3,
                                          },
                                          shadowOpacity: 0.1,
                                          shadowRadius: 5,
                                          width: 80,
                                          alignItems: "center",
                                          paddingVertical: 5,
                                          borderRadius: 5,
                                          marginLeft: 10,
                                          marginTop: 2,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 14,
                                            fontWeight: "800",
                                            color: "black",
                                            padding: 4,
                                          }}
                                        >
                                          {moment(
                                            appointmentEnd,
                                            "h:mm a"
                                          ).format("h:mm A")}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                  <View>
                                    {showMessage && (
                                      <View
                                        style={{
                                          backgroundColor: "black",
                                          marginTop: 10,
                                          borderRadius: 10,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "white",
                                            fontSize: 14,
                                            fontWeight: "600",
                                            padding: 5,
                                            textAlign: "center",
                                          }}
                                        >
                                          Please Add Some Remark For Cancelling
                                          the Appointment
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <View
                                    style={{
                                      backgroundColor: "#D9D9D9",
                                      height: 200,
                                      borderRadius: 10,
                                      padding: 10,
                                      marginHorizontal: 10,
                                      marginTop: 20,
                                    }}
                                  >
                                    <TextInput
                                      scrollEnabled={true}
                                      multiline={true}
                                      placeholder="Any reason to Update the Appointment"
                                      onChangeText={(text) => {
                                        setRemark(text);
                                      }}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      paddingHorizontal: 15,

                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Button
                                      title="Cancel"
                                      onPress={() =>
                                        setModalVisible(!isModalVisible)
                                      }
                                      buttonStyle={{
                                        marginVertical: 10,
                                        width: "45%",
                                        paddingVertical: 5,
                                        backgroundColor: "#e13945",
                                      }}
                                      buttonTextStyle={{ fontSize: 15 }}
                                    />
                                    <Button
                                      title="Update 11"
                                      onPress={() => {
                                        handleUpdate();
                                        showModalMessage();
                                      }}
                                      buttonStyle={{
                                        marginVertical: 10,
                                        width: "45%",
                                        paddingVertical: 5,
                                      }}
                                      buttonTextStyle={{ fontSize: 15 }}
                                    />
                                  </View>
                                </ScrollView>
                              </View>
                            </ScrollView>
                          </SafeAreaView>
                        </Modal>
                        <SModal isVisible={isModalCancelVisible}>
                          <ScrollView style={{ marginTop: 100 }}>
                            <View
                              style={{
                                height: "100%",
                                backgroundColor: "white",
                                borderRadius: 10,
                                padding: 10,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginBottom: 15,
                                  marginTop: 5,
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() =>
                                    setModalCancelVisible(!isModalCancelVisible)
                                  }
                                >
                                  <Feather name="chevron-left" size={20} />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "600",

                                    textAlign: "center",
                                    marginLeft: 10,
                                  }}
                                >
                                  Are you sure you want to cancel ?
                                </Text>
                              </View>
                              <View>
                                {showMessage && (
                                  <View
                                    style={{
                                      backgroundColor: "black",
                                      marginTop: 10,
                                      borderRadius: 10,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "white",
                                        fontSize: 14,
                                        fontWeight: "600",
                                        padding: 5,
                                        textAlign: "center",
                                      }}
                                    >
                                      Please Add Some Remark For Cancelling the
                                      Appointment
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <View
                                style={{
                                  backgroundColor: "#D9D9D9",
                                  height: 200,
                                  borderRadius: 10,
                                  padding: 10,
                                }}
                              >
                                <TextInput
                                  onChangeText={(text) => setRemark(text)}
                                  scrollEnabled={true}
                                  multiline={true}
                                  placeholder="Please provide the reason to cancel the Appointment"
                                />
                              </View>
                              <View
                                style={{
                                  paddingHorizontal: 15,

                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 20,
                                  justifyContent: "space-between",
                                }}
                              >
                                <Button
                                  title="Back"
                                  onPress={() =>
                                    setModalCancelVisible(!isModalCancelVisible)
                                  }
                                  buttonStyle={{
                                    marginVertical: 10,
                                    width: "45%",
                                    paddingVertical: 5,
                                    backgroundColor: "#e13945",
                                  }}
                                  buttonTextStyle={{ fontSize: 16 }}
                                />
                                <Button
                                  title="Update"
                                  onPress={() => {
                                    handleUpdate(), showModalMessage();
                                  }}
                                  buttonStyle={{
                                    marginVertical: 10,
                                    width: "45%",
                                    paddingVertical: 5,
                                  }}
                                  buttonTextStyle={{ fontSize: 16 }}
                                />
                              </View>
                            </View>
                          </ScrollView>
                        </SModal>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item, idx) => `${idx}`}
              />
            )}
          </View>
        </ScrollView>

        {appointment.length === 0 ? (
          <View style={styles.nodata}>
            <AntDesign
              name="calendar"
              style={{ marginRight: 10 }}
              size={30}
              color="#D2AE6A"
            />
            <Text style={[styles.agendaName, { color: "#D2AE6A" }]}>
              No Appointment for this date{" "}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleTheme: (color) => dispatch(toggleTheme(color)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAppointment);

const styles = StyleSheet.create({
  container: {
      flex: 1,
    paddingBottom: 80,
    backgroundColor: "white",
    flexGrow: 1,
  },

  nodata: {
    //marginTop: 50,
    //borderWidth: 1,
    position: "absolute",
    zIndex: 999,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    width: wp("100%"),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  datepicker: {
    width: wp("70%"),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#D2AE6A",
  },
  dateArea: {
    marginRight: Math.max(10, wp("5%")),
  },
  dateText: {
    fontSize: 16 * responsive(),
    fontWeight: "bold",
    color: "white",
  },
  singleAgenda: {
   backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  agendaData: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agendaTime: {
    fontSize: 14 * responsive(),
    color: "#424242",
    fontWeight: "600",
  },
  agendaName: {
    fontSize: 15 * responsive(),
    color: "#424242",
    fontWeight: "600",
  },
  agendaServices: {
    fontSize: 14 * responsive(),
  },

 agendaImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
  },
  addBtnContainer: {
    marginBottom: 40,
    zIndex: 100,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceTag: {
    fontSize: 16,
    fontWeight: "800",
    backgroundColor: "#D2AE6A",
    color: "white",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
    alignSelf: "flex-start",
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Android Shadow
    elevation: 3,
  },
  fabGroup: {
    paddingBottom: 50,
  },
  staffViewWrapper: {
    paddingVertical: 10,
    display: "flex",
    height: 200,
    display: "flex",
    height: 200,
  },
  staffContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  appointmentHeadline: {
    fontSize: 16 * responsive(),
    margin: 0,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  singleStaffWrapper: {
    backgroundColor: "white",
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 3,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  staffImage: {
    width: wp("20"),
    height: wp("20"),
    resizeMode: "cover",
    borderRadius: 100 / 2,
    backgroundColor: "white",
    borderColor: "#f2f2f2",
    borderWidth: 2,
    marginBottom: 20,
  },
  staffText: {
    color: "#000",
  },
  Headingtitle: {
    textAlign: "center",
    paddingVertical: 2,
  },
  callButton: {
    position: "absolute",
    right: 4,
    top: "50%",
    transform: [{ translateY: -20 }],
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    shadowColor: "#D2AE6A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 3,
    backgroundColor: "#D2AE6A",
  }
});
