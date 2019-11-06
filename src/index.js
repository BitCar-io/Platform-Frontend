import React from "react";
import 'babel-polyfill'; // NOTE: REALLY important to avoid "regeneratorRuntime is not defined"
// import { isDeveloperMode } from "./util/helpers.js";
import ReactDOM from "react-dom";
import store from './store';
import { Provider } from 'react-redux';
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import 'react-image-lightbox/style.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  ,
  document.getElementById("root")
);
