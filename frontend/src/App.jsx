import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Button from "./core/components/Button/Button";
import Login from "./modules/Login/pages/Login";
import SignUp from "./modules/Signup/pages/SignUp";
import PrivateRoute from "./utils/PrivateRoute";
import Participants from "./modules/Participants/pages/Participants";
import ForgetPassword from "./modules/ForgetPass/pages/ForgetPassword";
import ResetPassword from "./modules/ForgetPass/pages/ResetPassword";

import EventsPage from "./modules/Events/pages/EventsPage";
import { Toaster } from "react-hot-toast";
import Workshops from "./modules/Workshops/pages/Workshops";
import Spaces from "./modules/Space/page/Spaces";
import Forms from "./modules/Form/pages/Forms";
import SingleEventPage from "./modules/Events/pages/SingleEventPage";
import SingleWorkshopPage from "./modules/Workshops/pages/SingleWorkshopPage";
import Dashboard from "./modules/Dashboard/pages/Dashboard";
import RegistartionForm from "./modules/Registration/EventReg/components/RegistartionForm";
import EventDetail from "./modules/Events/components/EventDetailsQR";
import CancelRegistration from "./modules/Participants/pages/CancelRegistration";
import AdminDashboardPage from "./modules/Admin-dashboard/pages/AdminDashboard";
import { UserData } from "./utils/UserData";
import AdminApproval from "./modules/admin/components/AdminApproval";
import PendingApproval from "./modules/admin/components/PendingApproval";
import CheckinRegistration from "./modules/Participants/pages/ParticipantsDetails";

function App() {
  const [userRole, setUserRole] = useState("user");

  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/events/details/:token" element={<EventDetail />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/participants"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Participants />
            </PrivateRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Workshops />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute allowedRoles={["user", "admin"]}>
              <EventsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/event/:eventId"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <SingleEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/spaces"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Spaces />
            </PrivateRoute>
          }
        />
        <Route
          path="/forms"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Forms />
            </PrivateRoute>
          }
        />
        <Route path="/form/:token" element={<RegistartionForm />} />
        <Route
          path="/cancel-registration/:token"
          element={<CancelRegistration />}
        />
        <Route
          path="/checkin-registration/:token"
          element={
            <PrivateRoute>
              <CheckinRegistration />
            </PrivateRoute>
          }
        />
        <Route
          path="/event/:eventId/workshop/:workshopId"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <SingleWorkshopPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
