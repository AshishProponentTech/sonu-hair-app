import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Menu, {
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

function LocationMenu() {
  return (
    <View>
      <Menu>
        <MenuTrigger text="Select location" />
        <MenuOptions>
          <MenuOption onSelect={() => alert(`Save`)} text="Save" />
          <MenuOption onSelect={() => alert(`Delete`)}>
            <Text style={{ color: "red" }}>Delete</Text>
          </MenuOption>
          <MenuOption
            onSelect={() => alert(`Not called`)}
            disabled={true}
            text="Disabled"
          />
        </MenuOptions>
      </Menu>
    </View>
  );
}

export default LocationMenu;

const style = StyleSheet.create({
  topmenu: {},
});
