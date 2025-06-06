import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Platform, Animated
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { getCategory } from "../service/CategoryWiseService";
import Loader from "../helper/loader";
import { ShowProfile } from "../service/MyProfile";
import configResponse from "../config/constant";
import { AuthContext } from "../helper/AuthContext";
import Icon1 from "../assets/images/icons/icon-1.png";
import Icon2 from "../assets/images/icons/icon-2.png";
import Icon3 from "../assets/images/icons/icon-3.png";
import Icon4 from "../assets/images/icons/icon-4.png";
import Icon5 from "../assets/images/icons/icon-5.png";
import Icon6 from "../assets/images/icons/icon-6.png";
import Icon7 from "../assets/images/icons/icon-7.png";
import Icon8 from "../assets/images/icons/icon-8.png";
import Icon9 from "../assets/images/icons/icon-9.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MyBooking } from "../service/BookingService";
import newsData from "../service/news";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import Location from "./Location";
import { AppStateContext } from "../helper/AppStateContaxt";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsive } from "../helper/responsive";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Carousel from "react-native-reanimated-carousel";
import { getAllStaff } from "../service/Staff";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { overlay } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
const Dashboard = ({ navigation }) => {
  const {
    setLocationModal,
    locationModal,
    location,
    setAppointmentCount,
    appointmentCount,
    guestMode,
  } = React.useContext(AppStateContext);
  const { signOut, state } = React.useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigate = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [getCategoryData, setCategory] = useState([
    {
      id: 1,
      name: "Haircut & Beard",
      type: "Service",
      image: require("../assets/ServiceImages/haircut.jpg"),
    },
    {
      id: 2,
      name: "Color Hair & Beard",
      type: "Service",
      image: require("../assets/ServiceImages/haircolor.jpg"),
    },
    {
      id: 3,
      name: "Threading",
      type: "Service",
      image: require("../assets/ServiceImages/threding.jpg"),
    },
    {
      id: 4,
      name: "Body Wax",
      type: "Service",
      image: require("../assets/ServiceImages/bodywax.jpg"),
    },
    {
      id: 5,
      name: "Perming/Curls",
      type: "Service",
      image: require("../assets/ServiceImages/curls.jpg"),
    },
    {
      id: 6,
      name: "Smooth & Straight Hairs",
      type: "Service",
      image: require("../assets/ServiceImages/straighthair.jpg"),
    },
    {
      id: 7,
      name: "Girl Hair Cut & Styling",
      type: "Service",
      image: require("../assets/ServiceImages/girlshaircut.jpg"),
    },
    {
      id: 8,
      name: "Facial",
      type: "Service",
      image: require("../assets/ServiceImages/facial.jpg"),
    },
    {
      id: 9,
      name: "Wig Service",
      type: "Service",
      image: require("../assets/ServiceImages/wig.jpg"),
    },
    {
      id: 10,
      name: "Makeup",
      type: "Service",
      image: require("../assets/ServiceImages/makeup.jpg"),
    },
    {
      id: 11,
      name: "Laser",
      type: "Service",
      image: require("../assets/ServiceImages/laser.jpg"),
    },
    {
      id: 12,
      name: "Massage",
      type: "Service",
      image: require("../assets/ServiceImages/massage.jpg"),
    },
  ]);
  const dummyData = [
    {
      news_image: require("../assets/ServiceImages/haircut.jpg"),
    },
    {
      news_image: require("../assets/ServiceImages/haircolor.jpg"),
    },
    {
      news_image: require("../assets/ServiceImages/threding.jpg"),
    },
  ];
  const [UserName, setName] = React.useState(null);
  const [UserEmail, setEmail] = React.useState(null);
  const [UserPic, setProfile] = React.useState(null);
  const [appointment, setAppointment] = React.useState([]);
  const [newData, setNewData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [page, setPage] = useState("");
  const _location = () => {
    setLocationModal(!locationModal);
  };
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };
  const openDrawer = () => {
    navigate.dispatch(DrawerActions.openDrawer());
  };
  const data = async () => {
    const value = await SecureStore.getItemAsync("location");
  };
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  useEffect(() => {
    setIsLoading(true);

    setWidth(() => Dimensions.get("window").width);
    setHeight(() => Dimensions.get("window").height);

    getCategory()
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data?.data;
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });

    return () => {
      setIsLoading(false);
    };
  }, [state.userToken]);
  const getProfile = () => {
    ShowProfile()
      .then(async (response) => {
        if (response?.status == 200) {
          const output = response?.data;
          const pic = output["pic"];

          setProfile(pic);
          setEmail(output["email"]);
          setName(`${output["first_name"]} ${output["last_name"]}`);
        } else {
          signOut();
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };
  const _goBack = () => navigation.goBack();

  React.useEffect(() => {
    if (!guestMode) {
      getProfile();
    }
  }, [isFocused]);
  const isTablet = () => {
    // If the device is running on iOS, use the userInterfaceIdiom property to identify iPads
    if (Platform.OS === "ios") {
      return (height > 1024 || width > 1024) && Platform.isPad;
    } else {
      // For Android or other platforms, use a heuristic based on screen size
      return Math.min(height, width) >= 600;
    }
  };

  function loadData() {
    setIsLoading(true);
    const data = { action: "all" };
    MyBooking(data)
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data;
          setAppointment(output);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  }

  React.useEffect(() => {
    if (!guestMode) {
      loadData();
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (appointment.length) {
      setAppointmentCount(
        appointment.filter((a) => a.status === "pending").length
      );
    }
  }, [appointment, isFocused]);
  useEffect(() => {
    getAsyncData();
    newsData()
      .then((response) => {
        console.log("News response:", response?.data); // 👈 Add this
        setNewData(() => response.data);
      })
      .catch((err) => {
        console.error("News API error:", err); // 👈 Add this
      });
  }, []);
  const onChangeModal = async () => {
    const data = `location=${location.id}&date=${moment(new Date()).format(
      "YYYY-MM-DD"
    )}`;

    await getAllStaff(data)
      .then((response) => {
        if (response?.status == 200) {
          const output = response?.data;

          setStaffData(() => output?.stafflist);
        } else {
          configResponse.errorMSG(response?.data?.message);
        }
      })
      .catch((error) => {
        configResponse.errorMSG(error.message);
      });
  };
  useEffect(() => {
    onChangeModal();
  }, [location.id]);
  const itemIcon = {
    "Haircut & Beard": Icon1,
    "Men Color Hair & Beard": Icon2,
    Threading: Icon3,
    "Body Wax": Icon4,
    "Perming/Curls": Icon5,
    "Smooth & Straight Hairs": Icon6,
    "Girl Hair cut & Styling": Icon7,
    Facial: Icon8,
    "Wig & Patch": Icon9,
  };
  const getAsyncData = async () => {
    try {
      const data = await AsyncStorage.getItem("appointment_id");
    } catch (err) { }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.container}>
            <View style={{ marginTop: 0 }}>
              <View style={{ height: "100%" }}>
                {isLoading ? (
                  <Loader />
                ) : (<View
                  style={
                    isTablet()
                      ? {
                        height: hp("95%"),
                        justifyContent: "space-between",
                      }
                      : { marginBottom: 70 }
                  }
                >
                  <LinearGradient
                    colors={['#D2AE6A', '#B18843']}
                    style={{
                      paddingBottom: 30,
                      borderBottomRightRadius: 5,
                      borderBottomLeftRadius: 5,
                      elevation: 10,
                    }}
                  >
                    <View style={styles.userWrapper}>
                      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                        <Image source={require("../assets/DrawerMenu/Menu.png")} />
                      </TouchableOpacity>
                      <View>
                        {guestMode ? (
                          <FontAwesome
                            name="user-circle-o"
                            size={110}
                            color="black"
                            style={styles.userProfile}
                          />
                        ) : (
                          <Image
                            resizeMode="cover"
                            style={[styles.userProfile, { width: 120, height: 120 }]}
                            source={{ uri: UserPic }}
                          />
                        )}
                      </View>
                    </View>
                    <View style={styles.name}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.nameTop]}
                      >
                        Welcome,
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.nameHeading}
                      >
                        {guestMode ? "Guest" : UserName}
                      </Text>
                    </View>
                  </LinearGradient>
                  <Animated.View
                    style={{
                      transform: [{ scale: scaleAnim }],
                      elevation: 4,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      marginTop: isTablet() ? -55 : -15,
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        borderRadius: 8,
                        borderWidth: 0.5,
                        borderColor: "#D2AE6A",
                        overflow: "hidden",
                      }}
                      onPress={_location}
                      onPressIn={onPressIn}
                      onPressOut={onPressOut}
                    >
                      <LinearGradient
                        colors={['#fff6e4d9', '#ffffffd2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          paddingHorizontal: 15,
                          paddingVertical: 12,
                          flexDirection: "row",
                          alignItems: "center",
                          borderRadius: 8,
                        }}
                      >
                        <Ionicons name="location-sharp" size={25} color="#D2AE6A" />
                        <Text
                          style={{
                            marginLeft: 12,
                            fontSize: 16,
                            color: "#333",
                            fontWeight: "600",
                            flexShrink: 1,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {location.address ? location.address : "Choose Your Location"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                  {guestMode && (
                    <View style={[styles.messageWrapper]}>
                      <Text style={styles.signUpMessage}>
                        We appreciate your interest in our app! To access our
                        full range of services, please log in or sign up.
                      </Text>
                      <Text style={styles.signUpMessage}>Thank you!</Text>
                      <Pressable
                        onPress={() => navigation.navigate("SignUp")}
                      >
                        <Text style={styles.signUpBtn}>Sign Up Now</Text>
                      </Pressable>
                    </View>
                  )}
                  <View style={[styles.newSection]}>
                    <Text style={[styles.commonHeading]}>
                      What's New
                    </Text>
                    <Carousel
                      loop
                      width={Dimensions.get("window").width}
                      height={isTablet() ? 400 : 210}
                      autoPlay={true}
                      data={newData && newData.length > 0 ? newData : dummyData}
                      style={styles.carousel}
                      scrollAnimationDuration={1000}
                      renderItem={({ item, index }) => (
                        <View
                          style={styles.slider}
                        >
                          <Image
                            source={
                              typeof item.news_image === 'number' || item.news_image.startsWith('http')
                                ? item.news_image
                                : { uri: item.news_image }
                            }
                            style={[styles.slideImage, { height: isTablet() ? "95%" : "100%" }]}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                    />
                  </View>
                  <View style={[styles.newSection]}>
                    <Text style={[styles.commonHeading]}>Top Services</Text>
                    <FlatList style={styles.bgWhite}
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={getCategoryData}
                      renderItem={({ item }) => (
                        <View>
                          <Pressable
                            onPress={() =>
                              navigation.navigate("Services", {
                                screen: "Service",
                                params: { id: item.id },
                              })
                            }
                            style={{ width: 180 }}>
                            <View
                              style={[
                                styles.SubUlgrid,
                                styles.shadowProp,
                                styles.box,
                              ]} >
                              <Image
                                resizeMode="cover"
                                style={styles.imageIcon}
                                source={item.image}
                              />
                              <View
                                style={styles.overlayImage}
                              ></View>
                              <Text style={styles.SubLigrid}>
                                {item.name}
                              </Text>
                            </View>
                          </Pressable>
                        </View>
                      )}
                    />
                  </View>
                  <View style={[styles.newSection]}>
                    {guestMode ? null : (
                      <Text style={styles.commonHeading}>Top Stylish</Text>
                    )}
                    {guestMode ? null : (
                      <FlatList
                        style={styles.bgWhite}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        contentContainerStyle={[
                          styles.flatListContainer,
                          { paddingBottom: isTablet() ? 40 : 40 },
                        ]}
                        data={staffData}
                        renderItem={({ item }) => (
                          <LinearGradient
                            colors={['#ffffff', '#ffffffd2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                              isTablet()
                                ? [styles.imageContainer, styles.cardBox]
                                : [styles.imageContainer, styles.cardBox]
                            ]}
                          >
                            <Image
                              source={{ uri: item?.pic }}
                              style={styles.cardImage}
                              resizeMode="cover"
                            />
                            <Text
                              style={{
                                marginTop: 10,
                                fontSize: 14,
                                fontWeight: '600',
                                textAlign: 'center',
                                width: "100%"
                              }}
                              numberOfLines={1}
                            >
                              {item.name}
                            </Text>
                          </LinearGradient>
                        )}
                      />
                    )}
                  </View>
                </View>
                )}
              </View>
              <Location navigation="" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  TopHeader: {
    backgroundColor: "#D2AE6A",
    paddingHorizontal: 5,
    elevation: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: "row",
  },
  header: {
    fontSize: 18 * responsive(),
    fontWeight: "bold",
  },
  location: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {},
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  signUpMessage: {
    color: "#ff8c8a",
    marginBottom: 10,
  },
  messageWrapper: {
    backgroundColor: "#ffe6e5",
    display: "flex",
    flexDirection: "column",
    margin: 20,
    alignItems: "flex-start",
    borderColor: "#ff8c8a",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
  servicesView: {},
  pageHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pageHeading: {
    marginLeft: 15,
    fontSize: 18 * responsive(),
    fontWeight: "bold",
  },
  serviceView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  topNav: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#FFD700",
    paddingBottom: 10,
  },
  location: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    alignSelf: "center",
  },
  slider: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slideImage: {
    width: wp("95%"),
    borderRadius: 20,
    alignSelf: "center",
  },
  newTextOne: {
    fontSize: 16 * responsive(),
  },
  newTextTwo: {
    fontWeight: "bold",
    fontSize: 16 * responsive(),
  },
  newText: {
    display: "flex",
    flexDirection: "row",
    fontSize: 16 * responsive(),
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  newSection: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  searchIcon: {
    position: "absolute",
    right: 20,
    top: 8,
    fontSize: 20 * responsive(),
    color: "lightgray",
  },
  userWrapper: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    width: "90%",
    paddingHorizontal: 20,
  },
  userProfile: {
    borderRadius: 100,
    marginTop: 15,
  },
  name: {
    marginLeft: 20,
  },
  nameTop: { fontWeight: "400", fontSize: 18, color: "white" },
  nameHeading: {
    fontSize: 25 * responsive(),
    fontWeight: "bold",
    color: "white"
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 6,
    fontSize: 12 * responsive(),
    fontSize: 12 * responsive(),
    backgroundColor: "#FFD700",
    fontWeight: "bold",
    overflow: "hidden",
  },
  appointment: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderColor: "#FFD700",
    margin: 20,
  },
  digit: {
    marginRight: 20,
  },
  heading: {
    fontSize: 20 * responsive(),
    fontWeight: "600",
    marginBottom: 10,
  },
  commonHeading: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  bgWhite: {
    backgroundColor: "white",
  },
  SubUlgrid: {
    borderRadius: 15,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    height: Math.max(wp("16.667%"), 100),
    width: "92%",
    alignSelf: "center",
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 0,
    elevation: 10,
  },
  SubLigrid: {
    fontSize: 14 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "white",
    marginTop: 15,
    textAlign: "center",
    position: "absolute",
    fontWeight: "700",
  },
  scrollStyle: {
    height: "auto",
  },
  box: {
    borderRadius: 15,
    overflow: "hidden",
  },
  serviceContainer: {
    padding: 8,
  },
  imageIcon: {
    width: "100%",
    height: "100%",
  },
  overlayImage: {
    backgroundColor: "black",
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.4,
    borderRadius: 15,
  },
  linktext: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderColor: "#FFD700",
    color: "#FFD700",
    overflow: "hidden",
    fontSize: 16 * responsive(),
  },
  signUpBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderColor: "#ff8c8a",
    color: "#ff8c8a",
    overflow: "hidden",
  },
  flatListContainer: {},
  imageContainer: {
    marginHorizontal: 10,
    elevation: 3,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2.5,
    borderRadius: 10,
  },
  cardBox: {
    borderColor: "#D2AE6A",
    borderWidth: 0.5,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 110,
    borderWidth: 1,
    borderColor: "#D2AE6A",
    marginRight: 4,
  },
  cardImage: {
    borderColor: "#D2AE6A",
    borderWidth: 0.5,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
});
