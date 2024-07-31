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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();
import { Provider } from "react-redux";
const store = configureStore({
  reducer: {
    eventsStore: eventsStore,
    workshopsStore: workshopsStore,
    spacesStore: spacesStore,
    formsStore: formsStore,
    participantsStore: participantsStore,
    registrationStore: registrationStore,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
      <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);
