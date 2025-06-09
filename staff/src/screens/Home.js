import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  BackHandler,
} from "react-native";
import { connect, useSelector, useDispatch } from "react-redux";
import { toggleTheme, removeUserToken, saveUserToken } from "../actions";
import { getAppointmentCount, getAppointment, loadAppointment} from "../actions/appoinmentsActions";
import { Ionicons, AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CLEAR_ERRORS } from "../actions/actionTypes";
import { getAPP } from "../services/authServices";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import Toast from "react-native-root-toast";
import { responsive } from "../../../helper/responsive";
import { useIsFocused } from "@react-navigation/native";
import { isTablet } from "../../../components/tablet";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import PropTypes from "prop-types";

function Home({ navigation, color, removeUserToken, toggleTheme }) {
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' }); // "May"
  const currentYear = date.getFullYear(); // 2025

  const isFocused = useIsFocused();
  const backPressCount = useRef(0);
  const [appointmentCountLoad, setAppointmentCountLoad] = useState(false);
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.Auth);
  const { appointmentCount, latestAppointment, error } = useSelector(
    (state) => state.AppointmentReducer
  );
  const daily_appointments = useMemo(
    () => appointmentCount?.daily_appointments,
    [appointmentCount?.daily_appointments]
  );
  const monthly_appointments = useMemo(
    () => appointmentCount?.monthly_appointments,
    [appointmentCount?.monthly_appointments]
  );
  const totalAppointments = useMemo(
    () => appointmentCount?.total_appointments,
    [appointmentCount?.total_appointments]
  );
  const yearly_appointments = useMemo(
    () => appointmentCount?.yearly_appointments,
    [appointmentCount?.yearly_appointments]
  );
  const showAlert = () =>
    Alert.alert("No Internet", "Please check your internet connection");

  NetInfo.fetch().then((state) => {
    if (!state.isConnected) {
      showAlert();
    }
  });
  useEffect(() => {
    if (token !== null) {
      dispatch(saveUserToken(token));
      dispatch(getAppointment(token));
      dispatch(getAppointmentCount(token));
    }
  }, [token, isFocused]);

  useEffect(() => {
    if (Object.keys(error).length !== 0) {
      Toast.show(error?.message, {
        duration: Toast.durations.LONG,
      });
      dispatch({ type: CLEAR_ERRORS });
    }
  }, [error]);
  useEffect(() => {
    getAPP(token)
      .then(async (res) => {
        if (await res.data) {
          setAppointmentCountLoad(true);
          dispatch(loadAppointment(await res.data));
        } else {
          setAppointmentCountLoad(true);
        }
      })
      .catch(async (err) => { });
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount.current === 1) {
        BackHandler.exitApp();
      } else {
        Toast.show("Press again to exit", {
          duration: Toast.durations.LONG,
        });
        backPressCount.current += 1;
        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const cardComponent = (title, count) => {
    const iconSize = isTablet() ? 30 : 20;
    const iconColor = color.secondaryColor;
    let IconComponent;
    switch (title) {
      case "Today":
        IconComponent = SimpleLineIcons;
        break;
      case "This Month":
        IconComponent = Ionicons;
        break;
      case "This Year":
        IconComponent = Ionicons;
        break;
      default:
        IconComponent = AntDesign;
    }

    let iconName;
    switch (title) {
      case "Today":
        iconName = "calendar";
        break;
      case "This Month":
        iconName = "calendar-number-outline";
        break;
      case "This Year":
        iconName = "calendar-outline";
        break;
      default:
        iconName = "calendar";
    }
    let displayTitle;
    if (title === "Today") {
      displayTitle = "Today";
    } else if (title === "All Time") {
      displayTitle = "All Time";
    } else if (title === "This Month") {
      displayTitle = currentMonth;
    } else if (title === "This Year") {
      displayTitle = currentYear;
    } else {
      displayTitle = title;
    }
    return (
      <TouchableOpacity
        style={{
          width: isTablet() ? "48%" : "47.5%",
          height: isTablet() ? "100%" : "100%",
        }}
        disabled={true}
        onPress={() => navigation.navigate("ViewAppointment")}
      >
        <View style={styles.cardComponent}>
          <Text ellipsizeMode="tail" style={styles.countNumber}>
            {count}
          </Text>
          <View style={styles.cardTitle}>
            <View style={{ paddingVertical: 1 }}>
              <IconComponent
                name={iconName}
                size={iconSize}
                color={iconColor}
                style={styles.iconCss}
              />
            </View>
            <Text
              ellipsizeMode="tail"
              style={{
                fontSize: 18,
                paddingVertical: 4,
                color: "#fff",
                textAlign: "center",
                fontWeight: Platform.OS == "ios" ? "500" : "700",
              }}
            >
              {displayTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeViewArea}>
        <View style={[styles.containerWrapper]}>
          <LinearGradient
            colors={['#B18843', '#D2AE6A']}
            style={styles.backgroundGradient}
          >
            <View style={[styles.topDataWrapper]}>
              {user?.name && (
                <View style={{ paddingRight: 10, paddingLeft: 20 }} >
                  <View style={styles.infoWrapper}>
                    <View style={{ alignItems: "flex-start" }}>
                      <TouchableOpacity
                        onPress={() => navigation.toggleDrawer()}
                      >
                        <Image
                          source={require("../../../assets/DrawerMenu/Menu.png")}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.infoImage}>
                      <Image
                        source={{ uri: user?.staff_profile }}
                        style={isTablet() ? { width: 200, height: 200, borderRadius: 100, } : styles.infoMainImage
                        } resizeMode="contain" />
                    </View>
                  </View>
                  <View>
                    <Text style={styles.infoNameHeading}> Hi, {user.name}</Text>
                    <Text style={styles.infoNameSubheading}>Welcome back</Text>
                  </View>
                </View>
              )}
              {appointmentCountLoad && latestAppointment?.length === 0 && (
                <View style={[styles.pagerWrapper]}>
                  <AntDesign
                    name="calendar"
                    color={"#333333"}
                    style={{ marginRight: 10 }}
                    size={25}
                  />
                  <Text style={styles.pagerHeading}>
                    No Appointments for Today
                  </Text>
                </View>
              )}
              {!appointmentCountLoad && (
                <View style={[styles.pagerWrapper]}>
                  <AntDesign
                    name="calendar"
                    color={"#333333"}
                    style={{ marginRight: 10 }}
                    size={30}
                  />
                  <Text style={styles.pagerHeading}>
                    List of Appointments loading...
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
          <ScrollView contentContainerStyle={styles.cardSection}>
            <View
              style={{
                marginHorizontal: 10,
              }}>
              <View>
                <Text
                  style={styles.heading} >
                  Appointments
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginHorizontal: isTablet() ? 40 : 10,
                }}
              >
                {cardComponent("Today", daily_appointments)}
                {cardComponent("This Month", monthly_appointments)}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginHorizontal: isTablet() ? 40 : 10,
                }}>
                {cardComponent("This Year", yearly_appointments)}
                {cardComponent("All Time", totalAppointments)}
              </View>
            </View>
          </ScrollView>
        </View>
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
    removeUserToken: () => dispatch(removeUserToken()),
  };
}
Home.propTypes = {
  navigation: PropTypes.object.isRequired,
  color: PropTypes.object,
  removeUserToken: PropTypes.func,
  toggleTheme: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
const styles = StyleSheet.create({
  cardSection: {
    borderColor: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingBottom: 120,
  },
  cardComponent: {
    paddingTop: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexGrow: 1,
    shadowColor: '#f3e3c2b5',
    borderColor: '#f3e3c2',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  iconCss: {
    color: "#fff",
  },
  cardTitle: {
    backgroundColor: "#D2AE6A",
    paddingVertical: 6,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderBlockColor: "#333",
    paddingHorizontal: 10,
  },
  heading: {
    alignSelf: "center",
    fontSize: 22,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  countNumber: {
    fontSize: isTablet() ? 50 : 45,
    fontWeight: Platform.OS == "ios" ? "600" : "800",
    textAlign: "center",
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerWrapper: {
    height: hp("90"),
    width: wp("100"),
    backgroundColor: "white",
  },
  reload: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    color: "white",
  },
  backgroundGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topDataWrapper: {
    paddingBottom: 30,
    backgroundColor: "transparent", // Remove solid background
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    // Remove duplicate elevation and paddingBottom
  },
  infoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 0,
  },
  infoImage: {
    padding: 10, // use number instead of string
    backgroundColor: "#333",
    borderRadius: 100,
  },
  infoMainImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  infoNameHeading: {
    fontSize: 26,
    color: "#333",
    fontWeight: "bold",
  },
  infoNameSubheading: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 5,
  },
  pagerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 20,
  },
  pagerHeading: {
    fontSize: 16 * responsive(),
    //marginVertical: 5,
    // padding: 10,
    color: "#333",
  },
  scrollWrapper: {
    width: wp("100%"),
    position: "relative",
    overflow: "visible",
  },
  scrollViewDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollView: {
    width: Dimensions.get("window").width / 2 - 10,
    backgroundColor: "white",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 5,
    position: "relative",
    overflow: "visible",
  },
  absolute: {
    position: "absolute",
    right: -6,
    top: -2,
  },
  absoluteChild: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: "white",
    overflow: "hidden",
    fontSize: 14 * responsive(),
  },

  done: {
    backgroundColor: "red",
  },
  live: {
    backgroundColor: "#78909c",
  },
  willBe: {
    backgroundColor: "green",
  },
  dateTime: {
    fontSize: 10 * responsive(),
  },
  scrollViewHeading: {
    fontSize: 18 * responsive(),
    marginBottom: 5,
  },
  statWrapper: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    flexDirection: "row",
    flexWrap: "wrap", // Apply flex wrap
    justifyContent: "space-between",
  },
  statItem: {
    backgroundColor: "white",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    padding: 10,
    borderRadius: 4,
  },
  statData: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  statDataName: {
    fontSize: 12 * responsive(),
    width: "65%",
  },
  statDataValue: {
    fontSize: 16 * responsive(),
    width: "35%",
    textAlign: "center",
  },
  callBtn: {
    color: "#fff",
    width: 45,
    paddingBottom: 2,
    paddingTop: 2,
    borderRadius: 10,
    fontSize: 14 * responsive(),
    textAlign: "center",
    backgroundColor: "#FFC000",
    overflow: "hidden",
  },
});