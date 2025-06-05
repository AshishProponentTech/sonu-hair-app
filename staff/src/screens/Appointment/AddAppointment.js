import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   ScrollView,
   StyleSheet,
   Pressable,
   Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { Headline, Button, ActivityIndicator } from "react-native-paper";
import ScreenHeader from "../../../../components/screenHeader";
import { getStaffs } from "../../actions/appDataActions";
import { responsive } from "../../../../helper/responsive";
import Toast from "react-native-root-toast";
import { isTablet } from "../../../../components/tablet";
import { SafeAreaView } from "react-native-safe-area-context";
const calendarTheme = {
   backgroundColor: "#ffffff",
   calendarBackground: "#ffffff",
   textSectionTitleColor: "#b6c1cd",
   textSectionTitleDisabledColor: "#d9e1e8",
   selectedDayBackgroundColor: "#D2AE6A",
   selectedDayTextColor: "#ffffff",
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
   textDayStyle: {
      fontSize: isTablet() ? 20 : 16 * responsive(),
      paddingTop: isTablet() ? -20 : null,
   },
};

function AddAppointment(props) {
   const dispatch = useDispatch();
   const [pageLoading, setPageLoading] = useState(true);
   const { user, token } = useSelector((state) => state.Auth);
   const { staffs, loading } = useSelector((state) => state.AppData);
   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
   const [selectedStaff, setSelectedStaff] = useState({});
   const [staffSelecting, setStaffSelecting] = useState(false);

   const nextPage = () => {
      if (!staffs || !date) return;
      const appointmentData = {
         staff: Object.keys(selectedStaff).length !== 0 ? selectedStaff : user,
         date: date,
      };
      if (appointmentData.staff.role === 1) {
         Toast.show("Admin Don't Provide Services, Please Select From The List", {
            duration: Toast.durations.LONG,
         });
         return;
      }
      props.navigation.navigate("SelectServiceAndTime", { appointmentData });
   };
   const getAllStaff = (userToken, currentDate) => {
      dispatch(getStaffs(userToken, currentDate));
   };
   useEffect(() => {
  const timer = setTimeout(() => {
    setPageLoading(false);
  }, 3000);
  return () => clearTimeout(timer);
}, []);

   useEffect(() => {
      getAllStaff(token, date);
   }, [token,date]);
   return (
      <SafeAreaView style={styles.container}>
         <ScreenHeader
            title={"Appointment"}
            mainStyle={{height: 50, paddingVertical:10 }}
            onPress={() => props.navigation.goBack()}
         />
         <ScrollView>
            <View style={styles.calendarView}>
               <Text style={styles.appointmentHeadline}>Choose Appointment Date</Text>
               <Calendar
                  minDate={new Date().toISOString().split("T")[0]}
                  maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))
                     .toISOString()
                     .split("T")[0]}
                  onDayPress={(day) => {
                     const selectedDate = new Date(day.timestamp);
                     const formattedDate = selectedDate.toISOString().split("T")[0];
                     setDate(formattedDate);
                  }}
                  monthFormat={"MMMM yyyy"}
                  hideArrows={false}
                  hideExtraDays={true}
                  disableMonthChange={true}
                  firstDay={1}
                  hideDayNames={false}
                  showWeekNumbers={false}
                  onPressArrowLeft={(substractMonth) => substractMonth()}
                  onPressArrowRight={(addMonth) => addMonth()}
                  disableArrowLeft={false}
                  disableArrowRight={false}
                  disableAllTouchEventsForDisabledDays={true}
                  markedDates={{
                     [date]: { selected: true },
                  }}
                  theme={calendarTheme}
                  style={{ margin: 10 }}
               />
            </View>

            {loading ? (
               <View style={{ marginVertical: 20, alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#D2AE6A" />
                  <Text style={{ marginTop: 10, color: "#D2AE6A" }}>
                     Loading staff...
                  </Text>
               </View>
            ) : (
               (user.role === 1 || user.role === 2) && (
                  <View style={styles.staffViewWrapper}>
                     <Headline style={styles.appointmentHeadline}>Available Staff</Headline>
                     <ScrollView
                        contentContainerStyle={styles.staffContainer}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                     >
                        {staffs?.map((data) => {
                           const isSelected = selectedStaff.id === data.id;
                           return (
                              <Pressable
                                 key={data.id}
                                 onPress={() => {
                                    setStaffSelecting(true);
                                    setSelectedStaff(data);
                                    setTimeout(() => {
                                       setStaffSelecting(false);
                                    }, 500); // Adjust duration or replace with actual async call
                                 }}
                              >
                                 <View
                                    style={[
                                       styles.singleStaffWrapper,
                                       {
                                          backgroundColor: isSelected ? "#efe2c9" : "#fff",
                                          borderColor: isSelected ? "#D2AE6A" : "lightgray",
                                       },
                                    ]}
                                 >
                                    {isSelected && staffSelecting && (
                                       <View style={styles.loadingOverlay}>
                                          <ActivityIndicator size="small" color="#D2AE6A" />
                                       </View>
                                    )}

                                    <Image
                                       style={styles.staffImage}
                                       source={{ uri: data.pic }}
                                       resizeMode="contain"
                                    />
                                    <Text style={styles.staffText}>{data.name}</Text>
                                 </View>
                              </Pressable>
                           );
                        })}
                     </ScrollView>
                  </View>
               )
            )}
            <View
               style={{
                  ...styles.btnContainer,
                  marginTop: user.role === 1 || user.role === 2 ? 0 : 20,
               }}
            >
               <Button
                  icon="chevron-right"
                  mode="contained"
                  style={[styles.nextBtn, { backgroundColor: "#D2AE6A" }]}
                  onPress={nextPage}
                  disabled={loading}
               >
                  <Text style={{ fontSize: 14 * responsive() }}>
                     Select Service and time
                  </Text>
               </Button>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "white",
   },
   appointmentHeadline: {
      fontSize: 16 * responsive(),
      marginTop: 5,
      textAlign: "center",
      fontWeight: "bold",
      color: "black",
   },
   calendarView: {
      backgroundColor: "white",
   },
   staffViewWrapper: {
      paddingVertical: 10,
   },
   staffContainer: {
      marginTop: 10,
      marginHorizontal: 10,
   },
   singleStaffWrapper: {
      backgroundColor: "#fff",
      flex: 1,
      borderRadius: 7,
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginRight: 10,
      borderColor: "lightgray",
      borderWidth: 2,
      position: "relative",
   },
   staffImage: {
      width: isTablet() ? 150 : 100,
      height: isTablet() ? 150 : 100,
      resizeMode: "cover",
      borderRadius: isTablet() ? 100 : 50,
      borderColor: "#D2AE6A",
      borderWidth: 2,
      backgroundColor: "#ffffff",
      marginBottom: 5,
   },
   staffText: {
      color: "#000",
      fontSize: isTablet() ? 16 : 13,
      fontWeight: "600",
      textAlign: "center",
   },
   loadingOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)", // darker transparent overlay
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
},
   btnContainer: {
      flex: 1,
      paddingHorizontal: 10,
      padding: 10,
      alignItems: "center",
      marginBottom: 100,
   },
   nextBtn: {
      width: "auto",
      paddingHorizontal: 10,
      paddingVertical: isTablet() ? 5 : 0,
   },
});

export default AddAppointment;
