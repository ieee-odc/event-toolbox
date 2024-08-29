import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import eventsStore from "./core/Features/Events.js";
import workshopsStore from "./core/Features/Workshops.js";
import spacesStore from "./core/Features/Spaces.js";
import formsStore from "./core/Features/Forms.js";
import participantsStore from "./core/Features/Participants.js";
import registrationStore from "./core/Features/Registration.js";
import statsStore from "./core/Features/Stats.js";
import notificationStore from "./core/Features/Notifications.js";
import adminApprovalStore from "./core/Features/Admin.js";

import { Provider } from "react-redux";
const store = configureStore({
  reducer: {
    eventsStore: eventsStore,
    workshopsStore: workshopsStore,
    spacesStore: spacesStore,
    formsStore: formsStore,
    participantsStore: participantsStore,
    registrationStore: registrationStore,
    statsStore: statsStore,
    notificationStore: notificationStore,
    adminApprovalStore: adminApprovalStore
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
