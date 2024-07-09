import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import eventsStore from "./core/Features/Events.js"
import { Provider } from "react-redux";
const store = configureStore({
  reducer: {
    eventsStore: eventsStore,
  }
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}> 
    <Router>
      <App />
    </Router>
    </Provider>
  </React.StrictMode>
);
