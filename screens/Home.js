import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
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
// services
import { getCategory } from "../service/CategoryWiseService";
import ScreenHeader from "../components/screenHeader";
import { responsive } from "../helper/responsive";
import Spinner from "../helper/Spinner";

function Item({ item, navigation }) {
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
      }}
      onPress={() => navigation.navigate("Service", { id: item.id })}
    >
      <View style={[styles.SubUlgrid]}>
        <Image
          resizeMode="cover"
          source={itemIcon[item.name] ?? Icon1}
          style={{ tintColor: "#D2AE6A" }}
        />
        <Text style={styles.SubLigrid}>{item.name}</Text>
      </View>
    </Pressable>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

function Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const { state } = React.useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    getCategory()
      .then((response) => {
        setIsLoading(false);
        if (response?.status === 200) {
          const output = response?.data?.data;
          setCategoryData(output);
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
      <View style={styles.MasterView}>
        {!isLoading ? (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              paddingBottom: 50,
            }}
            data={categoryData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Item item={item} navigation={navigation} />}
            numColumns={2}
          />
        ) : (
          <Spinner />
        )}
      </View>
    </SafeAreaView>
  );
}

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  MasterView: {
    flex: 1,
    marginBottom: 50,
    backgroundColor: "white",
  },
  SubUlgrid: {
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#D2AE6A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#D2AE6A",
    marginBottom: 10,
  },
  SubLigrid: {
    fontSize: 13 * responsive(),
    fontFamily: configResponse.fontFamily,
    color: "black",
    marginTop: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
