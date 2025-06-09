import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { connect, useDispatch, useSelector } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Headline, Button, TextInput, RadioButton } from "react-native-paper";

import PhoneInput from "react-native-phone-number-input";

import { getClients } from "../../actions/appDataActions";

import { baseURL } from "../../constants";

import axios from "axios";

import Toast from "react-native-root-toast";

import { responsive } from "../../../../helper/responsive";

import ScreenHeader from "../../../../components/screenHeader";
import { isTablet } from "../../../../components/tablet";
import { SafeAreaView } from "react-native-safe-area-context";

let debouncerPhoneChange;

function AddAppointment(props) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const { clients } = useSelector((state) => state.AppData);

  const otherPageData = props.route.params.appointmentData;
  const [show, setShow] = useState(false);
  const [addClient, setAddclient] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, onChangePhone] = useState("");
  const [result, setResult] = useState(null);
  const [phoneCountry, setPhoneCountry] = useState({});
  const [loading, setLoading] = useState(false);
  const [indicatorLoading, setIndicatorLoading] = useState(false);
  const [error, setError] = useState("");
  const [gender, setGender] = useState("Male");
  const [test, setTest] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(0);
  const [phoneToastCheck, setPhoneToastCheck] = useState(true);
  const getClient = async (userToken, phone) => {
    setIndicatorLoading(() => true);
    // clearTimeout(() => debouncerPhoneChange);
    debouncerPhoneChange = setTimeout(async () => {
      dispatch(await getClients(userToken, phone));
      if (clients.length === 0 && phoneToastCheck) {
        setPhoneToastCheck(false);
        Toast.show(
          "If you don't see the data, please try re-entering the number",
          {
            duration: Toast.durations.LONG,
          }
        );
      }
      setIndicatorLoading(false);
    }, 100);
  };

  const handleResult = (data) => {
    onChangePhone(data?.phone);
    setTest(false);
    setClicked(true);

    setImmediate(() => {
      setTest(true);
      setShow(false);
      setResult(data);
    });
  };

  const handleAddClient = () => {
    const obj = {
      first_name: firstname,
      last_name: null,
      gender: gender,
      country_code: phoneCountry.cca2 ? phoneCountry["cca2"] : "1",
      dial_code: phoneCountry.callingCode ? phoneCountry.callingCode[0] : "CA",
      phone: phone,
      email: null,
    };

    if (obj.first_name.length == 0) {
      return Toast.show("Enter valid name", {
        duration: Toast.durations.LONG,
      });
    }

    if (obj.phone.length != 10) {
      return Toast.show("The phone must be of 10 digits.", {
        duration: Toast.durations.LONG,
      });
    }

    addNewClient(token, obj);
  };

  const addNewClient = async (userToken, clientData) => {
    setLoading(true);
    setError("");

    try {
      const config = {
        method: "post",
        url: `${baseURL}/staff/client`,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${userToken}`,
          Connection: `keep-alive`,
        },
        data: clientData,
      };
      const { data } = await axios(config).catch((err) => { });

      if (data.status) {
        setLoading(false);

        Toast.show("Client added successfully!", {
          duration: Toast.durations.LONG,
        });
        const summary = { ...otherPageData, client: data.client_details };
        props.navigation.navigate("AppointmentSummary", { summary });
      }
      if (data.status == false) {
        setLoading(false);
        Toast.show(data.message, {
          duration: Toast.durations.LONG,
        });
      }
    } catch (error) {
      setLoading(false);

      Toast.show("Entered value are invalid or server is not responding", {
        duration: Toast.durations.LONG,
      });
    }
  };

  useEffect(() => {
    if (phone !== "" && phone.length >= 4) {
      getClient(token, phone);
      setCount(0);
    } else if (
      phone !== "" &&
      phone.length >= 4 &&
      phone.length <= 6 &&
      phoneToastCheck == false
    ) {
      setPhoneToastCheck(true);
    } else {
      if (count === 1) {
        Toast.show("Please Enter At Least Four Digit", {
          duration: Toast.durations.LONG,
        });
      }
      setCount(() => count + 1);
    }
  }, [phone]);

  useEffect(() => {
    if (error != "") {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      Toast.show(error, {
        duration: Toast.durations.LONG,
      });
    }
  }, [error]);

  useEffect(() => {
    if (phone != "" && clients?.length > 0) {
      setShow(() => true);
    } else {
      setShow(() => false);
    }

    setResult(null);
  }, [phone]);

  useEffect(() => {
    if (result !== null) {
      setFirstname(result.first_name);
      setLastname(result.last_name);
      setEmail(result.email);
    }
  }, [result, phone]);

  useEffect(() => {
    if (clients?.length === 0) {
      setResult(null);
      setFirstname("");
      setLastname("");
      setEmail("");
      setAddclient(true);
    } else {
      setAddclient(false);
    }
  }, [result, phone, clients]);

  const nextPage = () => {
    const summary = { ...otherPageData, client: result };
    summary?.client?.first_name &&
      props.navigation.navigate("AppointmentSummary", { summary });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={"Add Client"}
        mainStyle={{ height: "8%" }}
        onPress={() => props.navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.existingClientContainer, { marginTop: 10 }]}>
            <Headline style={styles.appointmentHeadline}>
              {addClient ? "Add Client" : "Choose Existing Client"}
            </Headline>
          </View>
          <View style={styles.newClientContainer}>
            <View style={styles.addClientContainer}>
              <View style={styles.phoneContainer}>
                {/* onChangePhone */}
                {test && (
                  <PhoneInput
                    value={phone}
                    defaultCode="CA"
                    layout="first"
                    placeholder="Enter At Least 4 Digit Number"
                    onChangeText={(text) => onChangePhone(text)}
                    onChangeCountry={setPhoneCountry}
                    containerStyle={styles.phoneContainerStyle}
                    textInputStyle={styles.textInputStyle}
                    codeTextStyle={styles.codeTextStyle}
                    textInputProps={{
                      placeholderTextColor: 'gray',
                      numberOfLines: 1,
                      ellipsizeMode: 'tail',
                      style:{
                        fontSize: 14.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                    theme={{
                      colors: { primary: props.color.secondaryColor },
                    }}
                    textColor="black"
                  />
                )}
              </View>
              {
                show && (
                  <View style={styles.clientResult}>
                    {phone && indicatorLoading ? (
                      <View>
                        <ActivityIndicator size="large" />
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "800",
                            textAlign: "center",
                            marginVertical: 10,
                          }}
                        >Loading Details ....
                        </Text>
                      </View>
                    ) : null}
                    {!indicatorLoading &&
                      phone.length >= 4 &&
                      clients?.map((data, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => handleResult(data)}
                          style={{
                            borderRadius: 10,
                            marginBottom: 10,
                            backgroundColor: "white",
                            elevation: 8,
                            shadowColor: "#000000",
                            shadowOffset: {
                              width: 0,
                              height: 3,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                          }}
                        >
                          <Text style={styles.resultText}>
                            {data.first_name} {data.last_name} ({data.phone}){" "}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                )
              }
              {!show && result !== null && (
                <View>
                  <TextInput
                    label=" name"
                    value={firstname}
                    style={[
                      styles.addClientInput,
                      { alignSelf: "center", width: "90%", marginTop: 10 },
                    ]}
                    onChangeText={(text) => {
                      setFirstname(text);
                    }}
                    theme={{
                      colors: { primary: props.color.secondaryColor },
                    }}
                    textColor="black"
                  />
                </View>
              )}
              {addClient && (
                <View
                  style={{
                    width: "90%",
                    alignSelf: "center",
                    marginTop: 10,
                  }}
                >
                  <TextInput
                    label="name"
                    value={firstname}
                    style={styles.addClientInput}
                    onChangeText={(text) => {
                      setFirstname(text);
                    }}
                    theme={{
                      colors: { primary: props.color.secondaryColor },
                    }}
                    textColor="black"
                  />
                  <View style={[styles.inputWrapper, styles.gender]}>
                    <Text>Gender :</Text>
                    <RadioButton.Android
                      value={gender}
                      status={gender === "Male" ? "checked" : "unchecked"}
                      onPress={() => setGender("Male")}
                      color={"#D2AE6A"}
                    />
                    <Text>Male</Text>
                    <RadioButton.Android
                      value={gender}
                      status={gender === "Female" ? "checked" : "unchecked"}
                      onPress={() => setGender("Female")}
                      color={"#D2AE6A"}
                    />
                    <Text>Female</Text>
                  </View>
                  {!loading && (
                    <View style={styles.additionBtnContainer}>
                      <Button
                        mode="contained"
                        onPress={handleAddClient}
                        style={{
                          backgroundColor: "#D2AE6A",
                          marginHorizontal: 10,
                          paddingHorizontal: 10,
                        }} >Add</Button>
                      <Button
                        mode="contained"
                        onPress={() => {
                          setAddclient(!addClient);
                        }}
                        contentStyle={{}}
                        style={{
                          backgroundColor: "#D2AE6A",
                          marginHorizontal: 10,
                          paddingHorizontal: 10,
                        }}
                      >Back</Button>
                    </View>
                  )}
                  {loading && (
                    <View style={styles.additionBtnContainer}>
                      <Headline style={styles.appointmentHeadline}>
                        Please Wait
                      </Headline>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {!addClient && (
          <View style={styles.btnContainer}>
            <Button
              icon="chevron-right"
              mode="contained"
              style={[
                styles.nextBtn,
                {
                  backgroundColor: "#D2AE6A",
                  marginTop: 15,
                },
              ]}
              onPress={nextPage}
            >
              <Text style={{ fontSize: 14 * responsive() }}>
                Continue to summary
              </Text>
            </Button>
          </View>
        )}
      </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  phoneContainer: {
    backgroundColor: "white",
    width: wp("100%"),
    position: "relative",
    zIndex: 20,
  },

  gender: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    padding: 10,
    marginTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  resultText: {
    fontSize: 15 * responsive(),
    width: wp("100%"),
    padding: 10,
    textAlign: "center",
    borderColor: "lightgray",
    zIndex: 10,
  },
  clientResult: {
    fontSize: 14 * responsive(),
    textAlign: "right",
    width: wp("100%"),
    backgroundColor: "white",
    backgroundColor: "white",
    marginTop: 10,
    width: "90%",
    paddingBottom: 150,
    alignSelf: "center",
  },
  phoneContainerStyle: {
    backgroundColor: "#EAEAEA",
    width: wp("90%"),
    alignSelf: "center",
    borderRadius: 10,
  },
  textInputStyle: {
    fontSize: 16 * responsive(),
  },
  appointmentHeadline: {
    fontSize: 18 * responsive(),
    margin: 0,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  codeTextStyle: {
    fontSize: 15 * responsive(),
    color: "#000000",
  },
  existingClientContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingTop: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  newClientContainer: {
    flex: 4,
    paddingTop: 20,
  },
  addClientContainer: {
    flex: 1,
  },
  dataPicker: {
    width: wp("100%"),
    backgroundColor: "white",
  },
  inputWrapper: {
    flex: 3,
  },
  additionBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#F6F6F6",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  addClientInput: {
    backgroundColor: "#F6F6F6",
    color: "red",
    borderRadius: 10,
  },
  btnContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    bottom: Platform.OS == "ios" ? "15%" : "12%",
    alignSelf: "center",
  },
  nextBtn: {
    width: "auto",
    paddingHorizontal: 10,
    paddingVertical: isTablet() ? 5 : 0,
  },
});
