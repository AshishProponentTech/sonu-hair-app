import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  StatusBar,
  Image,
  PixelRatio,
  FlatList,
} from "react-native";
import Loader from "../helper/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
// constants imports
import configResponse from "../config/constant";
import { AuthContext } from "../helper/AuthContext";
// images imports/
import Icon1 from "../assets/images/icons/icon-1.png";
import Icon2 from "../assets/images/icons/icon-2.png";
import Icon3 from "../assets/images/icons/icon-3.png";
import Icon4 from "../assets/images/icons/icon-4.png";
import Icon5 from "../assets/images/icons/icon-5.png";
import Icon6 from "../assets/images/icons/icon-6.png";
import Icon7 from "../assets/images/icons/icon-5.png";
import Icon8 from "../assets/images/icons/icon-3.png";
import Icon9 from "../assets/images/icons/icon-4.png";
// services
import { getCategory } from "../service/CategoryWiseService";
import { AppStateContext } from "../helper/AppStateContaxt";
import {
  useNavigation,
  DrawerActions,
  useRoute,
} from "@react-navigation/native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";
import { responsive } from "../helper/responsive";
import ScreenHeader from "../components/screenHeader";
function Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [getCategoryData, setCategory] = useState([]);
  const { signOut, state } = React.useContext(AuthContext);
  const { setLocationModal, locationModal, location } =
    React.useContext(AppStateContext);
  const navigate = useNavigation();
  const route = useRoute();
  const [page, setPage] = React.useState("");

  const openDrawer = () => {
    navigate.dispatch(DrawerActions.openDrawer());
  };
  const _location = () => {
    setLocationModal(!locationModal);
  };

  function Item({ item }) {
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

    return (
      <Pressable
        style={{
          width: "50%",
          paddingHorizontal: 5,
        }} // Adjusted width and added paddingHorizontal for spacing
        onPress={() =>
          navigation.navigate("Service", {
            id: item.id,
          })
        }
      >
        <View style={[styles.SubUlgrid, styles.shadowProp, styles.box]}>
          <Image resizeMode="cover" source={itemIcon[item.name] ?? Icon1} />
          <Text style={styles.SubLigrid}>{item.name}</Text>
        </View>
      </Pressable>
    );
  }

  useEffect(() => {
    setIsLoading(true);
    getCategory()
      .then((response) => {
        setIsLoading(false);
        if (response?.status == 200) {
          const output = response?.data?.data;
          setCategory(output);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={"Services"} onPress={() => navigation.goBack()} />
      <StatusBar backgroundColor="black" barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.MasterView}>
          {!isLoading ? (
            <FlatList
              style={{ flex: 1, paddingVertical: 20 }}
              data={getCategoryData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Item item={item} />}
              numColumns={2} // Assuming you want 3 items per row
            />
          ) : (
            <Loader />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#f5f5f5",
    backgroundColor: "#FFFFFF",
  },
  pageHeading: {
    marginLeft: 15,
    fontSize: 18 * responsive(),
    fontWeight: "bold",
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
  pageHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  location: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    marginBottom: 30,
  },
  MasterView: {
    //flex: 1,
    //display: "flex",
    // justifyContent: "space-between",
    // flexDirection: "row",
    // flexWrap: "wrap",
    //paddingVertical: 20,
    backgroundColor: "white",
  },
  serviceCol: {
    width: "50%",
    height: "auto",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "red",
  },
  SubUlgrid: {
    borderRadius: 10,
    backgroundColor: "#ffffff",

    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //borderWidth: 0.5,

    // display: "flex",
    //flexWrap: "nowrap",
    //flexDirection: "column",
    //padding: 10,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    //height: "50%",
    //overflow: "hidden",
    alignSelf: "center",
    // width: "100%",
    width: "80%",
  },
  shadowProp: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 15,
    backgroundColor: "white",
  },
  SubLigrid: {
    fontSize: 13 * responsive(),
    fontFamily: configResponse.fontFamily,
    // color: "#70757a",
    color: "black",
    marginTop: 15,

    fontWeight: "700",
    textAlign: "center",
  },
  scrollStyle: {},
});
