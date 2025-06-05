import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import { Root, Popup } from "react-native-popup-confirm-toast";
import configResponse from "../config/constant";
import { getStaffById, getServiceById } from "../service/Staff";
import {
  BookApointment,
  MyBooking,
  BookRescheduleAppointment,
} from "../service/BookingService";
import { RootStateContext } from "./../helper/RootStateContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { responsive } from "../helper/responsive";
import ScreenHeader from "../components/screenHeader";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "../components/button";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { isTablet } from "../components/tablet";
import { LinearGradient } from 'expo-linear-gradient';

function BookingConfirmation({ navigation, route }) {
  const { setAppointmentData } = React.useContext(RootStateContext);
  const [AppLoading, setApploading] = React.useState(false);
  const [ArtistImage, setArtistImage] = React.useState(null);
  const [ArtistName, setArtistName] = React.useState(null);
  const [ArtistSelf, setArtistSelf] = React.useState(null);
  const [ServiceName, setServiceName] = React.useState(null);
  const [ServiceDuration, setServiceDuration] = React.useState(null);
  const [TimeSlot, setTimeSlot] = React.useState(null);
  const [bookingConfirmation, setBookingConfirmation] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [appointmentId, setAppointmentId] = React.useState(0);
  const [ServiceLocation, setServiceLocation] = React.useState(null);
  const data = route?.params?.goNextValue;

  React.useEffect(() => {
    const staff_id = `id=${data?.staff_id}`;
    const service_id = `id=${data?.service_id}`;
    const start_time = data?.start_time;
    setApploading(true);

    getStaffById(staff_id)
      .then((response) => {
        if (response?.status == 200) {
          const output = response?.data;

          setArtistName(output.name);
          setArtistSelf(output.about);
          setArtistImage({ uri: output.staff_profile });
          setServiceLocation(output.location);
          getServiceById(service_id)
            .then((response) => {
              if (response?.status == 200) {
                const serviceData = response?.data?.data;
                setServiceName(serviceData[0].name);
                setServiceDuration(serviceData[0].duration);
                const end_time = moment(start_time, "hh:mm A")
                  .add(
                    serviceData[0].duration.replace(" Minutes", ""),
                    "minutes"
                  )
                  .format("hh:mm A");
                setTimeSlot(`${start_time} - ${end_time}`);
                setApploading(false);
              } else {
                configResponse.errorMSG(response?.data?.message);
              }
            })
            .catch((error) => {
              configResponse.errorMSG(error.message);
            });
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }, []);
  React.useEffect(() => {
    getAppointmentId();
  }, [appointmentId]);

  const getAppointmentId = async () => {
    try {
      const appointmentId = await AsyncStorage.getItem("appointment_id");
      setAppointmentId(() => appointmentId);

      return appointmentId;
    } catch (error) {
      console.error("Error occurred while getting appointment ID:", error);
      return null;
    }
  };
  const setRescheduleAppointment = async () => {
    try {
      const idString = String(0);
      await AsyncStorage.setItem("appointment_id", idString);
    } catch (error) {
      console.error("Error occurred while setting appointment ID:", error);
    }
  };

  function loadAppointments() {
    const data = { action: "all" };
    MyBooking(data)
      .then((response) => {
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

  const bookApointment = async () => {
    const bookingdata = {
      service_id: data?.service_id,
      date: data?.date,
      staff_id: data?.staff_id,
      start_time: data?.start_time,
    };

    const userPhone = await SecureStore.getItemAsync("userPhone");
    if (!userPhone) {
      data.phone = true;
      configResponse.errorMSG("Please complete your profile.");
      navigation.navigate("Profile", { data });
      return;
    }
    setApploading(true);
    BookApointment(bookingdata)
      .then((response) => {
        if (response?.status == 200) {
          setApploading(false);
          loadAppointments();
          setMessage(response?.data?.message);
          setBookingConfirmation(true);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };
  const bookRescheduleAppointment = async () => {
    const bookingRescheduleData = {
      service_id: data?.service_id,
      date: data?.date,
      staff_id: data?.staff_id,
      start_time: data?.start_time,
      appointment_id: appointmentId,
      reschedule: 1,
    };

    const userPhone = await SecureStore.getItemAsync("userPhone");
    if (!userPhone) {
      data.phone = true;
      configResponse.errorMSG("Please complete your profile.");
      navigation.navigate("Profile", { data });
      return;
    }
    setApploading(true);
    BookRescheduleAppointment(bookingRescheduleData)
      .then((response) => {
        if (response?.status == 200) {
          setApploading(false);
          // loadAppointments();
          setMessage(response?.data?.message);
          setBookingConfirmation(true);
          setRescheduleAppointment();
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };
  const navigateToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "ServiceStack" }],
    });
  };
  const redirect = () => {
    navigation.navigate("UpcomingBooking");
    setBookingConfirmation(false);
    navigateToDashboard();
  };
  const cardLayout = (title, text, subText, icons, location) => {
    return (
  <View style={styles.cardWrapper} accessible accessibilityLabel={`Card for ${title}`}>
    <Text style={styles.miniHeading}>{title}</Text>
    <View style={styles.contentContainer}>
      {location ? (
        <Ionicons name="location-outline" size={16} style={styles.iconStyle}  />
      ) : (
        <Feather
          name={icons || "calendar"}
          size={16}
        
          style={styles.iconStyle}
        />
      )}
      {text ? (
        <View style={[styles.textContainer, { flex: 1 }]}>
          <Text style={styles.smalltext}>{text}</Text>
          {subText && <Text style={styles.extratext}>{subText}</Text>}
        </View>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.smalltext}>
            {moment(data.date).format("MMM DD, YYYY")}
          </Text>
          <Text style={styles.extratext}>{TimeSlot}</Text>
        </View>
      )}
    </View>
  </View>
);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#D2AE6A" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollStyle}>
        {bookingConfirmation && (
          <View style={styles.box}>
            <View style={styles.confirm}></View>
            <View style={styles.modal}>
              <Icon name="check-square-o" size={50} color="green" />
              <Text style={styles.message}>{message}</Text>
              <View>
                <Pressable onPress={redirect}>
                  <Text style={styles.nextButton}>Show Booking Details</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate("Dashboard"), navigateToDashboard();
                  }}
                >
                  <Text style={styles.goback}>Go To DashBoard</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        <View style={styles.MasterView}>
          <ScreenHeader
            title={"Appointment"}
            onPress={() => navigation.goBack()}
          // mainStyle={{ height: "13%" }}
          />

          <Spinner
            visible={AppLoading}
            textContent={"Please wait..."}
            textStyle={styles.spinnerTextStyle}
          />
          <View style={styles.boxWrapper}>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <View style={styles.picoutline}>
                <Image
                  resizeMode="contain"
                  style={styles.pic}
                  source={ArtistImage}
                />
              </View>
              <Text style={styles.userName}>{ArtistName}</Text>
              <LinearGradient
                colors={['transparent', '#D2AE6A', '#D2AE6A', 'transparent']}
                start={{ x: 0, y: 0.5 }}
               end={{ x: 1, y: 0.5 }}
               style={{
                 paddingVertical: 3,
                 paddingHorizontal: 25,
                 marginBottom: 15,
               }}>
              <Text style={[styles.userTag]} >Specialist</Text>
              </LinearGradient>
            </View>
            {cardLayout("Booking List")}
            {cardLayout("Services", ServiceName, ServiceDuration, "shopping-bag")}
            {cardLayout("Location", ServiceLocation, null, "shopping-bag", true)}
            {appointmentId == 0 ? (
              <Button
                title={"Confirm & Book"}
                onPress={bookApointment}
              />
            ) : (
              <Button
                title={"Reschedule Booking"}
                onPress={bookRescheduleAppointment}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default BookingConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  confirm: {
    position: "absolute",
    height: "100%",
    width: "100%",
    //backgroundColor: "#fff",
    backgroundColor: "black",
    zIndex: 2,
    opacity: 0.5,
  },
  box: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
  boxWrapper: {
    backgroundColor: "white",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.38,
    shadowRadius: 1.0,
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    backgroundColor: "#fff7e8",
    width: "90%",
    display: "flex",
    alignItems: "start",
    justifyContent:"center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
 miniHeading: {
  fontSize: 13,
   color: "#D2AE6A",
  backgroundColor:"#fff7e830",
  fontWeight: "600",
  textAlign: "center",
  borderWidth: 1.2,
  borderColor: "#D2AE6A", 
  alignSelf: "flex-start",    
  paddingHorizontal: 10,  
  paddingVertical: 1,   
   borderRadius: 30, 
  marginBottom: 6,
},
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  textContainer: {
    marginLeft: 10
  },
  smalltext: {
    fontSize: 16 * responsive(),
    width: "100%",
    fontWeight: "600",
    color: "#333333",
    flexWrap: "wrap",
  },
  extratext: {
    width: "100%",
    fontSize: 13,
    fontWeight: "600",
    color: "#555555",
  },
  iconStyle: {
    backgroundColor: "#D2AE6A",
    color: "white",
    padding: 5.5,
    borderRadius: 5,
  },
  modal: {
    backgroundColor: "#fff",
    position: "absolute",
    top: "35%",
    left: "10%",
    height: 250,
    width: "80%",
    zIndex: 3,
    borderRadius: 6,
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  message: {
    fontWeight: "bold",
  },
  MasterView: {
    flex: 1,
    backgroundColor: "white",
  },
  serviceCol: {
    width: "100%",
    height: "auto",
    padding: 10,
  },
  outerBox: {
    backgroundColor: "#fff08d",
    borderRadius: 15,
    padding: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 40,
  },
  scrollStyle: {
    flex: 1,
    backgroundColor: "white",
  },
 picoutline: {
    height: 100,
    width: 100,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  pic: {
    height: "100%",
    width: "100%",
    borderRadius: 45,
  },
  userName: {
    fontSize: 18 * responsive(),
    fontWeight:"600",
    color: "#2c2c2c",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 10,
    letterSpacing: 0.25,
  },
  userTag: {
    fontSize: 14 * responsive(),
    color: "#fff",
    fontWeight:"600",
    letterSpacing: 1,
  },
  title: {
    fontSize: 17 * responsive(),
    fontFamily: "Inter_700Bold",
    color: "#000000",
    marginTop: 15,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
  textDis: {
    fontSize: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "#000000",
    marginTop: 1,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#D2AE6A",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 40,
    width: "60%",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 24 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "white",
    fontWeight: "700",
    marginTop: 1,
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
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
  spinnerTextStyle: {
    color: "#FFF",
  },
  nextButton: {
    textAlign: "center",
    // backgroundColor: "#FFD700",
    backgroundColor: "#D2AE6A",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 10,
  },
  goback: {
    textAlign: "center",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
  },
});
