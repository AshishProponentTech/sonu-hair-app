import {
  KEYBOARD_STATE_OFF,
  KEYBOARD_STATE_ON,
  PUSH_NOTIFICATION_TOKEN,
} from "../actions/actionTypes";

const initialState = {
  visible: false,
  pushNotificationToken: "",
};

const feature = (state = initialState, action) => {
  switch (action.type) {
    case KEYBOARD_STATE_ON:
      return {
        ...state,
        visible: true,
      };
    case KEYBOARD_STATE_OFF:
      return {
        ...state,
        visible: false,
      };

    case PUSH_NOTIFICATION_TOKEN:
      return {
        ...state,
        pushNotificationToken: action.payload.token,
      };

    default:
      return state;
  }
};

export default feature;
