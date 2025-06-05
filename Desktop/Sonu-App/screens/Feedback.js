import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import { ShowProfile } from "../service/MyProfile";
import configResponse from "../config/constant";
import { responsive } from "../helper/responsive";
import Feather from "react-native-vector-icons/Feather";
import ScreenHeader from "../components/screenHeader";
import { useNavigation } from "@react-navigation/native";
import DeleteAccount from "../service/delete";
import { AuthContext } from "../helper/AuthContext";
import SModal from "react-native-modal";
import Button from "../components/button";
export default function Feedback() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [phone, setPhone] = React.useState(null);
  const [message, setMessage] = React.useState(null);
  const [emailError, setEmailError] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);
  const [a, b] = useState(false);
  const { signOut } = React.useContext(AuthContext);
  function reset() {
    setNameError(false);
    setEmailError(false);
    setPhoneError(false);
    setMessageError(false);
    setMessage(null);
  }

  const submitContact = async () => {
    if (!message) {
      configResponse.errorMSG("Please enter your message");
      setMessageError(true);
      return;
    }
    const data = { name, email, phone, reason: message };
    setIsLoading(true);
    DeleteAccount(data)
      .then((response) => {
        setIsLoading(false);
        signOut();
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const getProfile = () => {
    ShowProfile()
      .then(async (response) => {
        if (response?.status == 200) {
          const output = response?.data;
          setMessage("");
          setPhone(output["phone"]);
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

  React.useEffect(() => {
    getProfile();
  }, []);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        onPress={() => navigation.goBack()}
        title={"Delete Account"}
        mainStyle={{ height: "8%" }}
      />
      <ScrollView contentContainerStyle={styles.scrollStyle}>
        <View style={styles.container_child}>
          <Feather
            name="alert-triangle"
            size={90}
            color={"#F32A2A"}
            style={styles.icon}
          />
          <TextInput
            value={name}
            placeholder="Name"
            disabled
            onChangeText={(text) => setName(text)}
            style={styles.InputBox}
          />
          <TextInput
            value={email.toLowerCase()}
            disabled
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            style={styles.InputBox}
            error={emailError}
          />
          <TextInput
            disabled
            value={phone}
            onChangeText={(text) => setPhone(text)}
            style={styles.InputBox}
          />
          <Pressable
            onPress={() => setModalVisible(!isModalVisible)}
            style={styles.SubmitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.SubmitButtonText}>Please wait ...</Text>
            ) : (
              <View>
                <Text style={styles.SubmitButtonText}>Delete Account </Text>
              </View>
            )}
          </Pressable>
          {isLoading ? null : (
            <Pressable
              style={[styles.SubmitButton, { backgroundColor: "#DFDFDF" }]}
              disabled={isLoading}
              onPress={() => navigation.goBack()}
            >
              <View>
                <Text
                  style={[
                    styles.SubmitButtonText,
                    { color: "black", fontWeight: "700" },
                  ]}
                >
                  Cancel
                </Text>
              </View>
            </Pressable>
          )}
        </View>
        <SModal isVisible={isModalVisible}>
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
                  //flexDirection: "row",
                  // alignItems: "center",
                  marginBottom: 15,
                  marginTop: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "black",
                    width: "18%",
                    borderRadius: 10,
                    paddingVertical: 5,
                  }}
                  onPress={() => setModalVisible(!isModalVisible)}
                >
                  <Feather name="chevron-left" size={18} color={"white"} />
                  <Text style={{ color: "white", fontSize: 16 }}>Back</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",

                    textAlign: "left",
                    marginLeft: 10,
                    marginTop: 10,
                    //width: "100%",
                  }}
                >
                  Are you sure you want to delete your account?
                </Text>
              </View>
              <TextInput
                label="Reason"
                value={message}
                mode="outlined"
                outlineColor="#e6f6f6"
                activeOutlineColor={configResponse.primaryColor}
                onChangeText={(text) => setMessage(text)}
                style={[
                  styles.InputBox,
                  { backgroundColor: "#FAFAFA", borderBottomWidth: 0 },
                ]}
                multiline={true}
                numberOfLines={4}
                error={messageError}
              />
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
                  onPress={() => setModalVisible(!isModalVisible)}
                  buttonStyle={{
                    marginVertical: 10,
                    width: "45%",
                    paddingVertical: 5,
                    backgroundColor: "red",
                  }}
                  buttonTextStyle={{ fontSize: 16 }}
                />
                <Button
                  title="Delete"
                  onPress={() => submitContact()}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container_child: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 20,
    position: "relative",
  },
  InputBox: {
    borderBlockColor: "black",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 1,
    marginBottom: 20,
    fontSize: 16 * responsive(),
  },
  SubmitButton: {
    width: "90%",
    padding: 10,
    backgroundColor: "#D1AE6C",
    borderRadius: 20,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    fontWeight: "700",
  },
  SubmitButtonText: {
    textAlign: "center",
    fontSize: 16 * responsive(),
    fontFamily: configResponse.fontFamily,
    // color: "#000000",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  scrollStyle: {
    height: "auto",
  },
  icon: {
    resizeMode: "cover",
    height: 90,
    width: 90,
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
