import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import "./bootswatch.less";
import Header from "./components/Header";
import FormContainer from "./containers/FormContainer";
import NotificationContainer from "./containers/NotificationContainer";
import configureStore from "./store/configureStore";
import "./styles.css";


const store = configureStore({
  notifications: [],
});

render((
  <Provider store={store}>
    <div>
      <Header/>
      <NotificationContainer/>
      <FormContainer/>
    </div>
  </Provider>
), document.getElementById("app"));
