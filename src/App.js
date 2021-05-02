import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
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

export const App = () => (
  <Provider store={store}>
    <div>
      <Header/>
      <NotificationContainer/>
      <FormContainer/>
    </div>
  </Provider>
);