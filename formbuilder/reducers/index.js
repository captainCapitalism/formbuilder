import {combineReducers} from "redux";
import dragndrop from "./dragndrop";

import form from "./form";
import notifications from "./notifications";


const rootReducer = combineReducers({
  notifications,
  form,
  dragndrop
});

export default rootReducer;
