import { Dimensions } from "react-native";

export const responsive = () => {
  const width = Dimensions.get("window").width;
  if (width < 376) {
    return 0.8;
  }
  if (width < 661) {
    return 1;
  }
  if (width < 800) {
    return 1.2;
  }
  if (width < 1000) {
    return 1.3;
  }
  if (width < 1200) {
    return 1.4;
  }
  if (width > 1200) {
    return 1.5;
  }
};
