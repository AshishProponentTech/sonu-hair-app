import { COLORS } from "../themes/color";

const initialState = {
  colorData: COLORS.light,
};

const Theme = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":
      switch (action?.payload?.name) {
        case "light":
          return { colorData: COLORS.dark };
        case "dark":
          return { colorData: COLORS.light };
        default:
          return state; 
      }
    default:
      return state;
  }
};

export default Theme;
