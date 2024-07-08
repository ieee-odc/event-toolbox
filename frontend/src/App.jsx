import { useState } from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Button from "./core/components/Button/Button";
import Login from "./modules/Login/pages/Login";
import SignUp from "./modules/Signup/pages/SignUp";
import PrivateRoute from "./utils/PrivateRoute";
import Participants from "./modules/Participants/pages/Participants";
import ForgetPassword from "./modules/ForgetPass/pages/ForgetPassword";
import Success from "./modules/TestAuth/pages/Success";
import ResetPassword from "./modules/ForgetPass/pages/ResetPassword";
import EventsPage from "./modules/Events/pages/EventsPage";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster />
      {/* for private routes use Private Route like this
   <Route path= "/participants" element ={<PrivateRoute allowedRoles={['organizer']}>
<Participants />
</PrivateRoute>}  />  */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/success" element={<Success />} />

        <Route path="/participants" element={<Participants />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </div>
  );
}

export default App;
