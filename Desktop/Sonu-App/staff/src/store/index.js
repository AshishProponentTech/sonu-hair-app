import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

const loggerMiddleware = createLogger();

export default store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware
  )
);
