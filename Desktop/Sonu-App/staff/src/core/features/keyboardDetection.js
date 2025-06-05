import { View, Text, Keyboard } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KEYBOARD_STATE_OFF,
  KEYBOARD_STATE_ON,
} from "../../actions/actionTypes";

export default function KeyboardDetection({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      dispatch({ type: KEYBOARD_STATE_ON });
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      dispatch({ type: KEYBOARD_STATE_OFF });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return <>{children}</>;
}
