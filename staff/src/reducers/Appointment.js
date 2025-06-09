import {
  APPOINTMENT_REQUEST,
  APPOINTMENT_REQUEST_SUCCESS,
  APPOINTMENT_REQUEST_FAIL,
  ADD_APPOINTMENT_REQUEST,
  ADD_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_FAIL,
  RESET_MESSAGE,
  APPOINTMENT_count_REQUEST,
  APPOINTMENT_count_SUCCESS,
  APPOINTMENT_count_FAIL,
  CLEAR_ERRORS,
  HOME_Page_APPOINTMENT,
} from "../actions/actionTypes";

const initialState = {
  appointment: [],
  appointmentCount: {},
  error: {},
  latestAppointment: [],
};

 const AppointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_APPOINTMENT_REQUEST:
    case APPOINTMENT_REQUEST:
      return {
        ...state,
        loading: true,
        appointment: [],
      };
    case APPOINTMENT_count_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case APPOINTMENT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        appointment: action.payload,
      };

    case APPOINTMENT_count_SUCCESS:
      return {
        ...state,
        loading: false,
        appointmentCount: action.payload,
      };
    case ADD_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        message: "Appointment Added Sucessfully",
      };

    case RESET_MESSAGE:
      return {
        ...state,
        message: "",
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: {},
      };

    case APPOINTMENT_count_FAIL:
    case ADD_APPOINTMENT_FAIL:
    case APPOINTMENT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: {
          message: action.payload.errors
            ? action.payload.errors
            : action.payload.message,
          status: false,
        },
      };

    case HOME_Page_APPOINTMENT:
      return {
        ...state,
        latestAppointment: action.payload,
      };
    default:
      return state;
  }
};
export default AppointmentReducer;