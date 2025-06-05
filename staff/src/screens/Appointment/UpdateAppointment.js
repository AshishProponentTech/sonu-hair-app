import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  ToastAndroid,
  BackHandler,
  Dimensions,
  Platform,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button, Headline } from "react-native-paper";
import moment from "moment";
import Modal from "react-native-modal";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import Loader from "../../components/GlobalComponent/Loader";
import { baseURL } from "../../constants";
import axios from "axios";
import { getAppointment } from "../../actions/appoinmentsActions";
import { getSlots } from "../../actions/appDataActions";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { AntDesign } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";
import { responsive } from "../../../../helper/responsive";

const Tab = createMaterialBottomTabNavigator();

UpdateAppointment = (props) => {
  const dispatch = useDispatch();
  const { appointment } = useSelector((state) => state.AppointmentReducer);
  const { user, token } = useSelector((state) => state.Auth);
  const { slots, testSlots } = useSelector((state) => state.AppData);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [seletedService, setSelectedService] = useState({});
  const [staffData, setStaffData] = useState({});
  const [serviceData, setServiceData] = useState([]);

  const [modalDatepicke, setModalDatepicke] = useState(false);
  const [updatedDate, setupdatedDate] = useState(new Date());

  //Updation modal states
  const [appointmentStart, setAppointmentStart] = useState("");
  const [appointmentEnd, setAppointmentEnd] = useState("");
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const insets = useSafeAreaInsets();

  const changeStartTime = (value, idx) => {
    setAppointmentStart(value);
  };

  const toggleModal = (data) => {
    setModalVisible(!isModalVisible);
    setSelectedService(data);
    setStaffData(data.staff);
    setServiceData(data.service);
    setAppointmentStart(data.start_time);
    setAppointmentEnd(data.end_time);
    setStatus(data.status);
    setRemark(data.remark);
    setupdatedDate(moment(data.date).toDate());
    dispatch(
      getSlots(token, moment(data.date).format("Y-M-D"), 15, data.staff.id)
    );
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onChangeModal = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setModalDatepicke(Platform.OS === "ios");
    setupdatedDate(currentDate);
  };

  const updateAppointments = async (userToken, appointmentData) => {
    try {
      const config = {
        method: "patch",
        url: `https://sonuhaircut.com/api/staff/appointment`,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${userToken}`,
          Connection: `keep-alive`,
        },
        data: appointmentData,
      };

      const { data } = await axios(config);
      if (data.status) {
        Toast.show("Updated successfully!", {
          duration: Toast.durations.LONG,
        });
        setLoading(false);
        setModalVisible(false);
        dispatch(getAppointment(token, moment(date).format("Y-M-D")));
      }
    } catch (error) {
      setLoading(false);
      Toast.show("Server Error", {
        duration: Toast.durations.LONG,
      });
    }
  };

  const handleUpdate = () => {
    setLoading(true);
    setError("");
    const appointmentData = {
      id: seletedService.appoinment,
      status: status,
      remark: remark,
      start_time: appointmentStart,
      end_time: appointmentEnd,
      date: moment(updatedDate).format("Y-M-D"),
    };

    updateAppointments(token, appointmentData);
    setRemark("");
  };

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

  return (
    <>
      <View style={styles.container}>
        {isLoading && (
          <Loader color={props.color} navigation={props.navigation} />
        )}

        {Object.keys(seletedService).length > 0 && (
          <Modal
            isVisible={isModalVisible}
            style={styles.updateModalStyle}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            {Platform.OS && <View style={{ paddingTop: insets.top }}></View>}
            <View style={styles.updateModalView}>
              <ScrollView>
                <View style={[styles.appInfo]}>
                  <View style={styles.clientDataContainer}>
                    <View style={styles.clientImageContainer}>
                      <Image
                        style={styles.clientDataImage}
                        source={{ uri: serviceData[0].img }}
                      />
                    </View>
                    <View style={styles.clientDataDetails}>
                      <Text style={styles.clientName}>
                        {seletedService?.client?.name}
                      </Text>
                      <Text style={styles.clientMobile}>
                        {seletedService?.client?.phone}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.updationDataContainer}>
                    <View
                      style={[
                        styles.updationDataInnerContainer,
                        { marginBottom: 20 },
                      ]}
                    >
                      <View style={styles.updationLabelContainer}>
                        <Text style={styles.updationLabel}>Staff :</Text>
                      </View>
                      <View style={styles.updationData}>
                        <Text style={styles.updationLabel}>
                          {staffData.name}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.updationDataInnerContainer}>
                      <View style={styles.updationLabelContainer}>
                        <Text style={styles.updationLabel}>Service:</Text>
                      </View>
                      <View style={styles.updationData}>
                        <Text style={styles.updationLabel}>
                          {serviceData[0].name}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.updationDataInnerContainer}>
                      <View style={styles.updationLabelContainer}>
                        <Text style={styles.updationLabel}>Start Time:</Text>
                      </View>
                      <View style={styles.updationData}>
                        <Picker
                          selectedValue={appointmentStart}
                          style={styles.dataPicker}
                          onValueChange={changeStartTime}
                        >
                          {slots.slot ? (
                            (() => {
                              let a = false;
                              slots.slot.forEach((ele, index) => {
                                if (a) return;
                                if (
                                  moment(ele, "hh:mm A").isBefore(
                                    moment(appointmentStart, "hh:mm A")
                                  )
                                ) {
                                } else {
                                  a = true;
                                  slots.slot = [
                                    ...slots.slot.slice(0, index),
                                    appointmentStart,
                                    ...slots.slot.slice(index),
                                  ];
                                }
                              });
                              slots.slot = [...new Set([...slots.slot])];

                              return slots.slot.map((t, idx) => {
                                return (
                                  <Picker.Item key={idx} label={t} value={t} />
                                );
                              });
                            })()
                          ) : (
                            <Picker.Item
                              label="No slot available for this day"
                              value="No slot available for this day"
                            />
                          )}
                        </Picker>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.updationDataInnerContainer,
                        { marginBottom: 20 },
                      ]}
                    >
                      <View style={styles.updationLabelContainer}>
                        <Text style={styles.updationLabel}>End Time:</Text>
                      </View>
                      <View style={styles.updationData}>
                        <Text style={styles.updationLabel}>
                          {moment(appointmentEnd, "h:mm a").format("h:mm A")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.updationDataInnerContainer}>
                      <View style={styles.updationLabelContainer}>
                        <Text style={styles.updationLabel}>Status:</Text>
                      </View>
                      <View style={styles.updationData}>
                        <Picker
                          selectedValue={status}
                          style={styles.dataPicker}
                          onValueChange={(itemValue, itemIndex) => {
                            setStatus(itemValue);
                          }}
                        >
                          <Picker.Item label="Pending" value="pending" />
                          <Picker.Item label="Complete" value="complete" />
                          <Picker.Item label="Cancelled" value="cancelled" />
                        </Picker>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.updationDataInnerContainer,
                        { marginBottom: 20 },
                      ]}
                    >
                      <View style={styles.updationLabelContainer}>
                        <Text style={styles.updationLabel}>Date:</Text>
                      </View>
                      <View style={styles.updationData}>
                        <View style={{ width: "100%" }}>
                          <Pressable
                            onPress={() => setModalDatepicke(!modalDatepicke)}
                            style={[styles.Icon]}
                          >
                            <Text style={[styles.updationLabel]}>
                              {moment(updatedDate).format("Y-M-D")}
                            </Text>
                            <AntDesign name="caretdown" color="gray" />
                          </Pressable>
                        </View>

                        {modalDatepicke && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={updatedDate}
                            mode={mode}
                            is24Hour={true}
                            display={
                              Platform.OS === "ios" ? "spinner" : "default"
                            }
                            onChange={onChangeModal}
                          />
                        )}
                      </View>
                    </View>

                    {status == "cancelled" && (
                      <View style={styles.updationDataInnerContainer}>
                        <View style={styles.updationLabelContainer}>
                          <Text style={styles.updationLabel}>Remark* :</Text>
                        </View>
                        <View style={styles.updationData}>
                          <TextInput
                            label="Remark"
                            value={remark}
                            onChangeText={(text) => setRemark(text)}
                            theme={{
                              colors: { primary: props.color.secondaryColor },
                            }}
                            style={[styles.inputBox, { color: "black" }]}
                            multiline
                            numberOfLines={2}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                  {!loading ? (
                    <View style={styles.updationBtnContainer}>
                      <Button
                        icon="check-all"
                        mode="contained"
                        onPress={handleUpdate}
                        style={{
                          backgroundColor: props.color.secondaryColor,
                          minWidth: 100,
                        }}
                      >
                        <Text style={{ fontSize: 14 * responsive() }}>
                          Update
                        </Text>
                      </Button>
                      <Button
                        icon="close-circle-outline"
                        mode="contained"
                        onPress={() => {
                          setRemark("");
                          setModalVisible(false);
                        }}
                        style={{
                          backgroundColor: props.color.secondaryColor,
                          minWidth: 100,
                        }}
                      >
                        <Text style={{ fontSize: 14 * responsive() }}>
                          Close
                        </Text>
                      </Button>
                    </View>
                  ) : (
                    <Text style={styles.updationLabel}>Please Wait ...</Text>
                  )}
                  {error !== "" && (
                    <Text style={{ color: "red" }}>{error}</Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </Modal>
        )}

        <View style={{ ...styles.datePickerContainer }}>
          <Button
            icon="calendar"
            mode="outlined"
            onPress={() => {
              setShow(!show);
            }}
            labelStyle={[styles.datePickerLabelStyle, { color: "#333" }]}
            contentStyle={styles.datePickerBtnContent}
            style={[styles.datePickerBtnStyle, { borderColor: "#333" }]}
          >
            {moment(date).format("DD MMM YYYY")}
          </Button>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
            />
          )}
        </View>

        <View style={styles.appointmentView}>
          <Headline style={styles.appointmentHeadline}>
            Available Appointments
          </Headline>
          <ScrollView
            contentContainerStyle={styles.appointmentScrollView}
            horizontal={false}
          >
            {appointment?.data?.map((data, idx) => {
              if (data?.status === "complete") return null;
              return (
                <View key={idx}>
                  <Pressable
                    style={styles.singleAppointment}
                    onPress={() => toggleModal(data)}
                  >
                    <View style={styles.singleAppImageContainer}>
                      <Image
                        source={{ uri: data.service[0].img }}
                        style={styles.singleAppImage}
                      />
                    </View>
                    <View style={styles.singleAppDetails}>
                      <Text style={styles.singleAppDetailsName}>
                        {data.client.name}
                      </Text>
                      <Text style={styles.singleAppDetailsTime}>
                        {data.start_time} - {data.end_time}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData,
  };
}

export default connect(mapStateToProps)(UpdateAppointment);

const styles = StyleSheet.create({
  updateDate: {
    width: "63%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Icon: {
    // width: 50,
    height: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  updateCalendar: {
    borderBottomWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  inputBox: {
    marginLeft: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "lightgray",
    padding: 10,
  },
  container: {
    flex: 1,
  },
  datePickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  datePickerBtnContent: {
    justifyContent: "center",
  },
  datePickerBtnStyle: {
    width: wp("80%"),
    maxWidth: 500,
  },
  datePickerLabelStyle: {
    fontSize: 14 * responsive(),
  },
  staffViewWrapper: {
    paddingVertical: 10,
    flex: 3,
  },
  appointmentHeadline: {
    fontSize: 16 * responsive(),
    margin: 0,
    textAlign: "center",
    color: "black",
  },
  staffContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  singleStaffWrapper: {
    backgroundColor: "white",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  staffImage: {
    width: wp("20"),
    height: wp("20"),
    resizeMode: "cover",
    borderRadius: 70 / 2,
    borderColor: "#f2f2f2",
    borderWidth: 2,
    marginBottom: 20,
  },
  staffText: {
    color: "#000",
  },
  appointmentView: {
    flex: 3,
    backgroundColor: "#eeeeee",
  },
  appointmentScrollView: {
    alignItems: "center",
    width: wp("100%"),
  },
  singleAppointment: {
    flexDirection: "row",
    width: wp("90%"),
    // justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 10 * responsive(),
    borderRadius: 10,
    shadowColor: "#000",
    marginBottom: 10,
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    marginHorizontal: 5,
  },
  singleAppImageContainer: {},
  singleAppImage: {
    width: Math.min(wp("15%"), 100),
    height: Math.min(hp("8%"), 50),
    resizeMode: "contain",
    borderRadius: 4,
    marginRight: 10 * responsive(),
  },
  singleAppDetails: {},
  singleAppDetailsName: {
    fontSize: 16 * responsive(),
    fontWeight: "bold",
  },
  singleAppDetailsTime: {},
  updateModalView: {
    backgroundColor: "white",
    flex: 1,
  },
  updateModalStyle: {
    margin: 0,
  },
  appInfo: {
    flex: 1,
    padding: 20,
  },
  clientDataContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  clientImageContainer: {
    flex: 1,
  },
  clientDataImage: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("15%") / 2,
    resizeMode: "cover",
  },
  clientDataDetails: {
    flex: 2,
    justifyContent: "center",
  },
  clientName: {
    fontSize: 18 * responsive(),
    color: "#333",
    fontWeight: "bold",
  },
  clientMobile: {
    color: "#333",
    fontWeight: "bold",
  },
  updationDataContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  updationDataInnerContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  updationLabelContainer: {
    flex: 1,
  },
  updationLabel: {
    color: "#333",
    fontSize: 14 * responsive(),
  },
  updationData: {
    flex: 2,
  },
  dataPicker: {
    color: "#333",
  },
  updationBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
});
