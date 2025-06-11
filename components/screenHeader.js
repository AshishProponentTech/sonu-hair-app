import { View, Text, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { isTablet } from "../components/tablet";
const screenHeader = ({ title, onPress, mainStyle }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#D1AE6C",
          height: "10%",
          paddingHorizontal: 20,
        },
        mainStyle,
      ]}
    >
      <Pressable
        style={{
          marginTop: 4,
        }}
        onPress={onPress}
      >
        <Ionicons name="arrow-back" size={isTablet() ? 24 : 20} color="black" />
      </Pressable>

      <Text
        style={{
          //marginLeft: 20,
          fontSize: isTablet() ? 24 : 20,
          fontWeight: "700",
          textAlign: "center",
          alignSelf: "center",
          width: "90%",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default screenHeader;
