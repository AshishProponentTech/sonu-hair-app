import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button, List } from "react-native-paper";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { baseURL } from "../../constants";
import axios from "axios";
import { getUnavailability } from "../../actions/appDataActions";
import { deleteUnavailability } from "../../actions/appDataActions";
import { AntDesign } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-root-toast";
import { responsive } from "../../../../helper/responsive";
import Modal from "react-native-modal";
import Feather from "react-native-vector-icons/Feather";
import ScreenHeader from "../../../../components/screenHeader";
import { ScrollView } from "react-native-gesture-handler";
const Item = (props) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.Auth);

  const deleteHoliday = () => {
    dispatch(deleteUnavailability(token, props.id));
  };

  useEffect(() => {}, []);

  return (
    <List.Item
      title={props.title}
      style={{
        backgroundColor: "whitesmoke",
        borderColor: "lightgray",
        borderWidth: 1,
        margin: 10,
        borderRadius: 10,
        elevation: 10,
      }}
      descriptionStyle={{
        marginTop: 10,
        color: "black",
        fontSize: 14 * responsive(),
      }}
      titleStyle={{
        color: "black",
        fontSize: 16 * responsive(),
      }}
      // titleStyle={{color:"white"}}
      description={props.description}
      // left={props => <List.Icon {...props} icon="clock-outline" />}
      right={(props) => (
        <View>
          {/* 
                <TouchableOpacity style={{ justifyContent: "center",alignItems:"center"  }} icon="close"
                    mode="contained"
                    >
                        
                        <Text style={{minWidth:100, marginBottom:8, textAlign:"center",color:"white", paddingHorizontal:4,paddingVertical:5, borderRadius:10,backgroundColor:"#ffc000"}}>Unapproved</Text>

                </TouchableOpacity> */}
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            icon="close"
            mode="contained"
            onPress={deleteHoliday}
          >
            <Text
              style={{
                minWidth: 100,
                textAlign: "center",
                color: "white",
                borderRadius: 10,
                overflow: "hidden",
                paddingHorizontal: 4,
                paddingVertical: 5,
                backgroundColor: "red",
                fontSize: 16 * responsive(),
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

function AddUnavailability(props) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.Auth);
  const { holidays, loading: spinnerLoading } = useSelector(
    (state) => state.AppData
  );
  //function states
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 15
    )
  );
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [holiday, setAddholiday] = useState(false);
  const [error, setError] = useState("");

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartDate(Platform.OS === "ios");
    setStartDate(selectedDate);
  };
  const onChangeEndDate = (event, selectedDate) => {
    setShowEndDate(Platform.OS === "ios");
    setEndDate(selectedDate);
  };

  const updateAppointments = async (userToken, holidayData) => {
    try {
      const config = {
        method: "post",
        url: `${baseURL}/staff/holiday`,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${userToken}`,
          Connection: `keep-alive`,
        },
        data: holidayData,
      };
      // setLoading(false)

      // return
      const { data } = await axios(config);
      if (data.status) {
        setLoading(false);
        dispatch(getUnavailability(token));
        setAddholiday(false);
        setRemark("");
      }
      if (data.errors) {
        setLoading(false);
        // ToastAndroid.show(data.errors, ToastAndroid.SHORT)
        Toast.show(data.errors, {
          duration: Toast.durations.LONG,
        });
        return;
      }
    } catch (error) {
      setLoading(false);
      // ToastAndroid.show("Server not responding", ToastAndroid.SHORT)
      Toast.show("Server not responding", {
        duration: Toast.durations.LONG,
      });
    }
  };

  const addAppointment = () => {
    if (
      moment(startDate).format("Y-M-D") === moment(new Date()).format("Y-M-D")
    ) {
      // ToastAndroid.show("You can't be off today", ToastAndroid.SHORT)
      Toast.show("You can't be off today", {
        duration: Toast.durations.LONG,
      });
      return;
    }
    setLoading(true);
    setError("");

    const data = {
      staff_id: user.id,
      start_date: moment(startDate).format("Y-M-D"),
      end_date: moment(endDate).format("Y-M-D"),
      remark,
    };

    // updateAppointments(token, { staff_id: user.id, start_date: moment(startDate).format("Y-M-D"), remark })
    updateAppointments(token, {
      staff_id: user.id,
      start_date: moment(startDate).format("Y-M-D"),
      end_date: moment(endDate).format("Y-M-D"),
      remark,
    });
  };

  useEffect(() => {
    const getStaffHolidays = () => {
      dispatch(getUnavailability(token));
    };
    getStaffHolidays();
  }, []);

  const handleGoback = () => {
    setRemark("");
    setAddholiday(!holiday);
  };

  return (
    <View style={styles.container}>
      {/* <View style={[styles.btns, { borderWidth: 1 }]}>
        {/* {!holiday && <Text style={styles.holidayTitle}>My Holidays</Text>} */}
      {/* <Text style={styles.holidayTitle}>My Holidays</Text> */}
      {/* <View style={{ width: 150 }}></View> */}
      {/* </View>  */}
      <ScreenHeader
        title="My Header"
        onPress={() => props.navigation.goBack()}
      />
      <View style={{ width: "80%", marginTop: 20, alignSelf: "center" }}>
        <Button
          icon={() => (
            <AntDesign
              // name={holiday ? "left" : "plus"}
              name="plus"
              color={"#ffffff"}
              style={{
                fontSize: 14 * responsive(),
              }}
            />
          )}
          mode="contained"
          onPress={handleGoback}
          contentStyle={{}}
          //style={{ backgroundColor: props.color.secondaryColor }}
          style={{ backgroundColor: "#D2AE6A" }}
        >
          <Text
            style={{
              fontSize: 14 * responsive(),
            }}
          >
            {/* {!holiday ? "Add New" : " Go Back"} */}
            Add New
          </Text>
        </Button>
      </View>
      {/* {!holiday && (
        <View style={styles.unavailabilityList}>
          {error !== "" && (
            <View style={styles.updationBtnContainer}>
              <Text style={[styles.updationLabel, { color: "red" }]}>
                {error}
              </Text>
            </View>
          )}
          <FlatList
            data={holidays}
            renderItem={({ item }) => (
              <Item
                title={item.remark}
                date={item.date}
                description={`from ${item?.start_date}  to  ${item?.end_date}`}
                id={item.id}
              />
            )}
            keyExtractor={(item) => `${item.id}`}
          />
          <Spinner
            visible={spinnerLoading}
            textContent={"Please Wait..."}
            textStyle={{ color: "#fff" }}
          />
        </View>
      )} */}
      <View style={styles.unavailabilityList}>
        {error !== "" && (
          <View style={styles.updationBtnContainer}>
            <Text style={[styles.updationLabel, { color: "red" }]}>
              {error}
            </Text>
          </View>
        )}
        <FlatList
          data={holidays}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <Item
              title={item.remark}
              date={item.date}
              description={`from ${item?.start_date}  to  ${item?.end_date}`}
              id={item.id}
            />
          )}
          keyExtractor={(item) => `${item.id}`}
        />
        <Spinner
          visible={spinnerLoading}
          textContent={"Please Wait..."}
          textStyle={{ color: "#fff" }}
        />
      </View>

      {/* {holiday && (
        <View style={styles.addUnavailability}>
          <View
            style={{
              flexDirection: Platform.OS == "ios" ? "column" : "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.updationLabel}>Select Date :</Text>
              <View style={styles.datePickerContainer}>
                <Button
                  icon="calendar"
                  mode="outlined"
                  onPress={() => {
                    setShowStartDate(!showStartDate);
                  }}
                  labelStyle={[
                    styles.datePickerLabelStyle,
                    { color: props.color.secondaryColor },
                  ]}
                  contentStyle={Platform.OS=="ios"?styles.datePickerBtnContentIOS:styles.datePickerBtnContentAndroid}
                  style={[
                    Platform.OS=="ios"?styles.datePickerBtnStyleIOS:styles.datePickerBtnStyleAndroid,
                    { borderColor: props.color.secondaryColor },
                  ]}
                >
                  {moment(startDate).format("DD MMM YYYY")}
                </Button>
                {showStartDate && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode={"date"}
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeStartDate}
                    textColor="red"
                    dateText={{
                      color: "red",
                    }}
                    minimumDate={new Date()}
                    maximumDate={endDate}
                  />
                )}
              </View>
            </View>
            <View>
              <Text style={styles.updationLabel}>End Date :</Text>
              <View style={styles.datePickerContainer}>
                <Button
                  icon="calendar"
                  mode="outlined"
                  onPress={() => {
                    setShowEndDate(!showEndDate);
                  }}
                  labelStyle={[
                    styles.datePickerLabelStyle,
                    { color: props.color.secondaryColor },
                  ]}
                  contentStyle={Platform.OS=="ios"?styles.datePickerBtnContentIOS:styles.datePickerBtnContentAndroid}
                  style={[
                    Platform.OS=="ios"?styles.datePickerBtnStyleIOS:styles.datePickerBtnStyleAndroid,
                    { borderColor: props.color.secondaryColor },
                  ]}
                >
                  {moment(endDate).format("DD MMM YYYY")}
                </Button>
                {showEndDate && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={endDate}
                    mode={"date"}
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeEndDate}
                    minimumDate={startDate}
                  />
                )}
              </View>
            </View>
          </View>

          <Text style={styles.updationLabel}>Remark :</Text>
          <View>
            <TextInput
              label="Remark"
              value={remark}
              onChangeText={(text) => setRemark(text)}
              theme={{ colors: { primary: props.color.secondaryColor } }}
              style={[
                styles.inputBox,
                {
                  borderColor: props.color.secondaryColor,
                  color: "black",
                  minHeight: 150,
                },
              ]}
              multiline
              numberOfLines={4}
            />
          </View>
          {!loading ? (
            <View style={[styles.updationBtnContainer, styles.btnContainer]}>
              <Button
                icon="plus"
                mode="contained"
                onPress={addAppointment}
                style={{ backgroundColor: props.color.secondaryColor,fontSize:14*responsive() }}
              >
                Submit
              </Button>
            </View>
          ) : (
            <Text style={styles.updationLabel}>Please Wait</Text>
          )}
        </View>
      )} */}
      <Modal
        isVisible={holiday}
        swipeDirection={"down"}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            height: "60%",
            backgroundColor: "white",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.addUnavailability}>
              <View
                style={{
                  flexDirection: Platform.OS == "ios" ? "column" : "column",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ marginTop: 5 }}>
                  <Text
                    style={[
                      styles.updationLabel,
                      { textAlign: "center", fontSize: 20, fontWeight: "600" },
                    ]}
                  >
                    Add Holidays
                  </Text>
                  <Text style={[styles.updationLabel, { marginTop: 10 }]}>
                    Select Date :
                  </Text>
                  <View style={styles.datePickerContainer}>
                    {/* <Button
                    icon="calendar"
                    mode="outlined"
                    onPress={() => {
                      setShowStartDate(!showStartDate);
                    }}
                    labelStyle={[
                      styles.datePickerLabelStyle,
                      { color: props.color.secondaryColor },
                    ]}
                    contentStyle={
                      Platform.OS == "ios"
                        ? styles.datePickerBtnContentIOS
                        : styles.datePickerBtnContentAndroid
                    }
                    style={[
                      Platform.OS == "ios"
                        ? styles.datePickerBtnStyleIOS
                        : styles.datePickerBtnStyleAndroid,
                      { borderColor: props.color.secondaryColor },
                    ]}
                  >
                    {moment(startDate).format("DD MMM YYYY")}
                  </Button> */}
                    <TouchableOpacity
                      onPress={() => setShowStartDate(!showStartDate)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          //borderWidth: 1,
                          // paddingVertical: 10,
                          //paddingHorizontal: 10,
                          borderRadius: 10,
                          backgroundColor: "#F6F6F6",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#EAEAEA",
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}
                        >
                          <Feather name="calendar" size={25} />
                        </View>

                        <Text
                          style={{
                            marginLeft: 15,
                            fontSize: 16,
                            fontWeight: "400",
                          }}
                        >
                          {moment(startDate).format("DD MMM YYYY")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {showStartDate && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={startDate}
                        mode={"date"}
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onChangeStartDate}
                        textColor="red"
                        dateText={{
                          color: "red",
                        }}
                        minimumDate={new Date()}
                        maximumDate={endDate}
                      />
                    )}
                  </View>
                </View>
                <View>
                  <Text style={styles.updationLabel}>End Date :</Text>
                  {/* <View style={styles.datePickerContainer}>
                  <Button
                    icon="calendar"
                    mode="outlined"
                    onPress={() => {
                      setShowEndDate(!showEndDate);
                    }}
                    labelStyle={[
                      styles.datePickerLabelStyle,
                      { color: props.color.secondaryColor },
                    ]}
                    contentStyle={
                      Platform.OS == "ios"
                        ? styles.datePickerBtnContentIOS
                        : styles.datePickerBtnContentAndroid
                    }
                    style={[
                      Platform.OS == "ios"
                        ? styles.datePickerBtnStyleIOS
                        : styles.datePickerBtnStyleAndroid,
                      { borderColor: props.color.secondaryColor },
                    ]}
                  >
                    {moment(endDate).format("DD MMM YYYY")}
                  </Button>
                  {showEndDate && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={endDate}
                      mode={"date"}
                      is24Hour={true}
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={onChangeEndDate}
                      minimumDate={startDate}
                    />
                  )}
                </View> */}
                  <TouchableOpacity
                    onPress={() => setShowEndDate(!showEndDate)}
                    style={{ marginTop: 5 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        //borderWidth: 1,
                        // paddingVertical: 10,
                        //paddingHorizontal: 10,
                        borderRadius: 10,
                        backgroundColor: "#F6F6F6",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#EAEAEA",
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                          borderTopLeftRadius: 10,
                          borderBottomLeftRadius: 10,
                        }}
                      >
                        <Feather name="calendar" size={25} />
                      </View>

                      <Text
                        style={{
                          marginLeft: 15,
                          fontSize: 16,
                          fontWeight: "400",
                        }}
                      >
                        {moment(endDate).format("DD MMM YYYY")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {showEndDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endDate}
                  mode={"date"}
                  is24Hour={true}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeEndDate}
                  minimumDate={startDate}
                />
              )}
              {/* <Text style={styles.updationLabel}>Remark :</Text> */}
              <View style={{ marginTop: 10 }}>
                <TextInput
                  label="Remark"
                  value={remark}
                  onChangeText={(text) => setRemark(text)}
                  theme={{ colors: { primary: props.color.secondaryColor } }}
                  style={[
                    styles.inputBox,
                    {
                      borderColor: props.color.secondaryColor,
                      color: "black",
                      minHeight: 150,
                    },
                  ]}
                  placeholder="Remark..."
                  multiline
                  numberOfLines={4}
                />
              </View>
              {!loading ? (
                <View
                  style={[styles.updationBtnContainer, styles.btnContainer]}
                >
                  {/* <Button
                  icon={() => (
                    <AntDesign
                      name={holiday ? "left" : "plus"}
                      color={"#ffffff"}
                      style={{
                        fontSize: 14 * responsive(),
                      }}
                    />
                  )}
                  mode="contained"
                  onPress={handleGoback}
                  contentStyle={{}}
                  style={{
                    width: "40%",
                    backgroundColor: "#D2AE6A",
                    borderRadius: 10,
                    //backgroundColor: props.color.secondaryColor,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14 * responsive(),
                    }}
                  >
                    {!holiday ? "Add New" : " Cancel"}
                  </Text>
                </Button> */}
                  <TouchableOpacity
                    style={{
                      //backgroundColor: props.color.secondaryColor,
                      backgroundColor: "#D2AE6A",
                      width: "40%",
                      fontSize: 14,
                      borderRadius: 10,
                    }}
                    onPress={() => handleGoback()}
                  >
                    <View style={{ paddingVertical: 10 }}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        Cancel
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* <Button icon="plus" mode="contained"></Button> */}
                  <TouchableOpacity
                    style={{
                      //backgroundColor: props.color.secondaryColor,
                      backgroundColor: "#D2AE6A",
                      width: "40%",
                      fontSize: 14,
                      borderRadius: 10,
                    }}
                    onPress={() => addAppointment()}
                  >
                    <View style={{ paddingVertical: 10 }}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        Submit
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.updationLabel}>Please Wait</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddUnavailability);

const styles = StyleSheet.create({
  btns: {
    //display: "flex",
    //flexDirection: "row",
    //justifyContent: "space-between",
    //alignItems: "center",
    //  padding: 10,
    //width: "100%",
    //height: "100%",
  },

  holidayTitle: {
    fontWeight: "bold",
    fontSize: 20 * responsive(),
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "space-around",
  },
  inputBox: {
    marginTop: 10,
    //borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: "#F6F6F6",
    elevation: 4,
  },
  addUnavailability: {
    flex: 1,
    padding: 20,
  },
  datePickerContainer: {
    marginBottom: 20,
    // marginTop: 20,
    marginTop: 5,
  },
  datePickerBtnContentAndroid: {
    //  justifyContent: "space-around",
  },
  datePickerBtnStyleAndroid: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 4,
  },
  datePickerBtnContentIOS: {
    // justifyContent: "space-around",
  },
  datePickerBtnStyleIOS: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    alignSelf: "center",
    borderWidth: 1,
    paddingHorizontal: 50,
    paddingVertical: 0,
  },
  datePickerLabelStyle: {
    fontSize: 16 * responsive(),
  },
  updationDataInnerContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
  },

  updationLabel: {
    color: "#333",
    fontSize: 14 * responsive(),
  },
  updationData: {
    flex: 1,
  },
  unavailabilityList: {
    //  flex: 1,
  },
  updationBtnContainer: {
    flexDirection: "row",
    //justifyContent: "flex-start",
    justifyContent: "space-between",
    //borderWidth: 1,
    //flex: 1,
  },
  btnContainer: {
    alignItems: "flex-start",
    //justifyContent: "center",
    marginTop: 20,
  },
});
