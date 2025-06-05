import { Platform, Dimensions } from "react-native";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
export const isTablet = () => {
  // If the device is running on iOS, use the userInterfaceIdiom property to identify iPads
  if (Platform.OS === "ios") {
    return (height > 1024 || width > 1024) && Platform.isPad;
  } else {
    // For Android or other platforms, use a heuristic based on screen size
    return Math.min(height, width) >= 600;
  }
};
