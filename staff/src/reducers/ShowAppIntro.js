import { APP_INTRO_STATUS } from "../constants";

const initialState = {
  appIntroStatus: APP_INTRO_STATUS.show,
};

export default ShowAppIntro = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_APP_INTRO":
      switch (action.payload.name) {
        case "show":
          return { appIntroStatus: APP_INTRO_STATUS.show };
        case "hide":
          return { appIntroStatus: APP_INTRO_STATUS.hide };
      }
    default:
      return state;
  }
};
