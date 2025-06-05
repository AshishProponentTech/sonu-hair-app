import {
  GET_SLOT_FAIL,
  GET_SLOT_SUCCESS,
  GET_SLOT_REQUEST,
  GET_SERVICES_FAIL,
  GET_SERVICES_SUCCESS,
  GET_SERVICES_REQUEST,
  GET_CLIENTS_FAIL,
  GET_CLIENTS_REQUEST,
  GET_CLIENTS_SUCCESS,
  GET_STAFF_FAIL,
  GET_STAFF_REQUEST,
  GET_STAFF_SUCCESS,
  GET_UNAVAILABLETY_REQUEST,
  GET_UNAVAILABLETY_FAIL,
  GET_UNAVAILABLETY_SUCCESS,
  DELETE_UNAVAILABLETY_REQUEST,
  DELETE_UNAVAILABLETY_SUCCESS,
  DELETE_UNAVAILABLETY_FAIL,
} from "../actions/actionTypes";

const initialState = {
  slots: {},
  services: [],
  clients: [],
  staffs: [],
  holidays: [],
  message: null,
};

export default appData = (state = initialState, action) => {
  switch (action.type) {
    case GET_CLIENTS_REQUEST:
    case GET_UNAVAILABLETY_REQUEST:
    case GET_SERVICES_REQUEST:
    case GET_SLOT_REQUEST:
    case GET_STAFF_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_SLOT_REQUEST:
      return {
        ...state,
        loading: true,
        slots: [],
      };

    case GET_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        slots: action.payload,
      };

    case GET_SERVICES_SUCCESS:
      return {
        ...state,
        loading: false,
        services: action.payload,
      };

    case GET_CLIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        clients: action.payload,
      };
    case GET_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        staffs: action.payload,
      };
    case GET_UNAVAILABLETY_SUCCESS:
      return {
        ...state,
        loading: false,
        holidays: action.payload,
      };
    case DELETE_UNAVAILABLETY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_UNAVAILABLETY_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case DELETE_UNAVAILABLETY_FAIL:
      return {
        ...state,
        loading: false,
      };

    case GET_CLIENTS_FAIL:
    case GET_UNAVAILABLETY_FAIL:
    case GET_STAFF_FAIL:
    case GET_SERVICES_FAIL:
    case GET_SLOT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_SLOT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        slots: [],
      };
    default:
      return state;
  }
};
