/**
 * Final screen of the add appointment flow
 * Goal of booking an appointment are being achieved here:
 * 1.Confirm the complete summary of the appointment
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button, Snackbar } from "react-native-paper";

import Loader from "../../components/GlobalComponent/Loader";
import {
  addAppointment,
  getAppointment,
  getAppointmentCount,
} from "../../actions/appoinmentsActions";
import { CLEAR_ERRORS, RESET_MESSAGE } from "../../actions/actionTypes";
import { getAPP } from "../../services/authServices";
import { loadAppointment } from "../../actions/appoinmentsActions";
import Toast from "react-native-root-toast";
import { responsive } from "../../../../helper/responsive";

import Feather from "react-native-vector-icons/Feather";

import ScreenHeader from "../../../../components/screenHeader";
import { isTablet } from "../../../../components/tablet";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native-elements";
var moment = require("moment");

const CircleOuter = (props) => {
  return <View style={props.style} />;
};

function AddAppointment(props) {
  const appointmentData = props.route.params.summary;

  const { token, user } = useSelector((state) => state.Auth);
  const { message, loading, error } = useSelector(
    (state) => state.AppointmentReducer
  );

  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [visible, setVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const gradientColor = ["#4a6572", "#3288b1", "#2d576b"];
  const gradientStart = [0, 0];
  const gradientEnd = [0, 0];

  const _onDismissSnackBar = () => {
    setVisibility(false);
  };

  const _toggleIsLoading = () => {
    setIsLoading(false);
  };

  const createAppointment = () => {
    const createAppointmentData = {
      client_id: appointmentData.client.id,
      staff_id: appointmentData.staff.id,
      service: appointmentData.service.id,
      date: appointmentData.date,
      start_time: appointmentData.start_time,
      end_time: moment(appointmentData?.end_time, "h:mm a").format("h:mm A"),
    };
    dispatch(addAppointment(createAppointmentData, token));
  };

  useEffect(() => {
    if (message) {
      Toast.show("Appointment added successfully!", {
        duration: Toast.durations.LONG,
      });
      console.log("Token", token);

      dispatch({ type: RESET_MESSAGE });
      dispatch(getAppointment(token));
      dispatch(getAppointmentCount(token));
      getAPP(token)
        .then(async (res) => {
          if (res) {
            dispatch(loadAppointment(await res.data));

            props.navigation.navigate("Book", { screen: "AddAppointment" });
          }
        })
        .catch((err) => {
          Toast.show("Something Went Wrong", {
            duration: Toast.durations.LONG,
          });
        });
    }
  }, [message, loading]);

  useEffect(() => {
    if (Object.keys(error).length !== 0) {
      Toast.show(error?.message, {
        duration: Toast.durations.LONG,
      });
      dispatch({ type: CLEAR_ERRORS });
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={"Appointment"}
        mainStyle={{ height: 80 }}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {isLoading && (
          <Loader
            action={_toggleIsLoading}
            color={props.color}
            navigation={props.navigation}
          />
        )}
        <CircleOuter style={styles.circleOne} />
        <CircleOuter style={styles.circleTwo} />
        <CircleOuter style={styles.circleThree} />
        <CircleOuter style={styles.circleFour} />
        <CircleOuter style={styles.circleFive} />
        <CircleOuter style={styles.circleSix} />
        <Snackbar
          style={{}}
          visible={visible}
          onDismiss={_onDismissSnackBar}
          action={{
            label: "Ok",
            onPress: () => {
              // Do something
            },
          }}
        >
          Hey there! Please confirm details.
        </Snackbar>

        <View style={styles.detailsWrapper}>
          <View style={styles.staffInfo}>
            <View style={styles.staffImageContainer}>
              <Image
                style={styles.staffImage}
                source={{ uri: appointmentData?.staff.pic }}
                resizeMode="contain"
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>
            <View style={styles.staffDetailContainer}>
              <Text
                style={[
                  styles.staffName,
                  { fontSize: 18, fontWeight: "300", marginTop: 10 },
                ]}
              >
                Specialist
              </Text>
              <Text style={styles.staffName}>
                {appointmentData?.staff?.name}
              </Text>
            </View>
          </View>
          <View style={styles.appointmentInfo}>
            <View style={styles.appointmantDateContainer}>
              <Text style={styles.appointmantDateLabel}>Client Name</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Feather name="user" size={20} style={{ marginTop: 10 }} />
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={[
                      styles.appointmantDateLabel,
                      { fontSize: 16, fontWeight: "600", marginTop: 5 },
                    ]}
                  >
                    {appointmentData?.client?.first_name}{" "}
                  </Text>

                  <Text style={[styles.appointmantDate]}>
                    Phone :{appointmentData?.client?.phone}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.appointmantDateContainer}>
              <Text style={styles.appointmantDateLabel}>Booking At </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Feather name="calendar" size={20} style={{ marginTop: 12 }} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.appointmantDate, { marginTop: 10 }]}>
                    {appointmentData?.date}
                  </Text>
                  <Text style={styles.appointmantTime}>
                    Time: {appointmentData?.start_time} -{" "}
                    {moment(appointmentData?.end_time, "h:mm a").format(
                      "h:mm A"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.appointmantDateContainer}>
              <Text style={styles.appointmantDateLabel}>Service Choose </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginTop: 10,
                }}
              >
                <Feather name="shopping-bag" size={20} />
                <View style={{ marginTop: -3, marginLeft: 10 }}>
                  <Text style={[styles.appointmantDate]}>
                    {appointmentData?.service?.name}
                  </Text>
                  <Text style={[styles.appointmantTime, { fontWeight: "700" }]}>
                    Duration: {appointmentData?.service?.duration}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <Button
            icon="chevron-right"
            style={[
              styles.nextBtn,
              {
                backgroundColor: "#D2AE6A",
              },
            ]}
            labelStyle={{ color: "#fff", paddingVertical: 2 }}
            mode="contained"
            onPress={createAppointment}
          >
            <Text style={{ fontSize: 16 * responsive() }}>
              {loading ? "Please Wait .." : "Confirm"}
            </Text>
          </Button>
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

const circleColor = "#fff3e0";
const textColor = "#333";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  btnContainer: {
    //flex: 2,
    padding: 10,
    marginTop: 20,

    backgroundColor: "#ffffff00",
    //alignItems: "flex-end",
  },
  appointmentHeadline: {
    fontSize: 16 * responsive(),
    marginBottom: 10,

    textAlign: "center",
  },
  nextBtn: {
    // width: wp("80%"),
    alignSelf: "center",
    width: "auto",

    paddingHorizontal: 10,
    paddingVertical: isTablet() ? 5 : 0,
  },
  detailsWrapper: {
    flex: 4,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    display: "flex",
    alignItems: "center",
  },
  staffInfo: {
    // flexDirection: "row",
    alignItems: "center",
    padding: 20,
    justifyContent: "space-around",
    //borderWidth: 1,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 10,
    marginTop: 10,
    width: "90%",
    backgroundColor: "white",
  },
  staffImageContainer: {
    //backgroundColor:"yellow"
  },
  staffImage: {
    width: 100 * responsive(),
    height: 100 * responsive(),
    borderRadius: isTablet() ? 80 : 100 / 2,
    // borderColor: "white",
  },
  staffDetailContainer: {
    paddingHorizontal: 10,
  },
  staffName: {
    fontSize: 30 * responsive(),
    color: textColor,
    textAlign: "center",
  },
  staffService: {
    fontSize: 20 * responsive(),
    color: textColor,
  },
  appointmentInfo: {
    flex: 1,
    // paddingBottom: 20,
    paddingTop: "10%",
    width: Math.min(wp("90%"), 800),
  },
  appointmantDateContainer: {
    //flexDirection: "row",
    //alignItems: "center",
    //justifyContent: "space-between",
    //padding: 10,
    //borderWidth: 1,
    paddingVertical: 10,

    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  appointmantDateLabel: {
    fontSize: 16 * responsive(),
    fontWeight: "400",
    color: textColor,
  },
  appointmantDate: {
    fontSize: 16 * responsive(),
    color: textColor,
    fontWeight: "600",
    marginBottom: 4,
  },
  appointmantTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    flex: 1,
  },
  appointmantTimeLabel: {
    fontSize: 20 * responsive(),
    fontWeight: "900",
    color: textColor,
  },
  appointmantTime: {
    fontSize: 16 * responsive(),
    color: textColor,
    fontWeight: "600",
  },
  circleOne: {
    backgroundColor: circleColor,
    borderRadius: wp("80%") / 2,
    width: wp("80%"),
    height: wp("80%"),
    position: "absolute",
    top: 0,
    left: 0,
  },
  circleTwo: {
    backgroundColor: circleColor,
    borderRadius: wp("20%") / 2,
    width: wp("20%"),
    height: wp("20%"),
    position: "absolute",
    top: wp("98%"),
    left: wp("20%"),
  },
  circleThree: {
    backgroundColor: circleColor,
    borderRadius: wp("10%") / 2,
    width: wp("10%"),
    height: wp("10%"),
    position: "absolute",
    top: wp("100%"),
    left: wp("80%"),
  },
  circleFour: {
    backgroundColor: circleColor,
    borderRadius: wp("10%") / 2,
    width: wp("10%"),
    height: wp("10%"),
    position: "absolute",
    top: wp("100%"),
    left: wp("80%"),
  },
  circleFive: {
    backgroundColor: circleColor,
    borderRadius: wp("5%") / 2,
    width: wp("5%"),
    height: wp("5%"),
    position: "absolute",
    top: wp("60%"),
    left: wp("90%"),
  },
  circleSix: {
    backgroundColor: circleColor,
    borderRadius: wp("5%") / 2,
    width: wp("5%"),
    height: wp("5%"),
    position: "absolute",
    top: wp("100%"),
    left: wp("10%"),
  },

  //Loader Model Styling

  modalContainer: {
    flex: 1,
  },
});
