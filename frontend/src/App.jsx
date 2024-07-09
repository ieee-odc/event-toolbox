<<<<<<< HEAD
import { useState } from 'react'
import './App.css'
import Participants from './modules/Participants/pages/Participants';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';

import { Toaster } from 'react-hot-toast';
import Table from './core/components/Table/Table';
import FormLandingPage from './modules/Form/pages/FormLandingPage';
import Space from './modules/Space/page/space'
=======
import { useState } from "react";
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
import FormLandingPage from "./modules/Form/pages/FormLandingPage";
>>>>>>> 75cc75078602f3a12e2d7f666218947c84302896

import { Toaster } from "react-hot-toast";
import Workshops from "./modules/Workshops/pages/Workshops";

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <Toaster/>
   {/* for private routes use Private Route like this
   <Route path= "/participants" element ={<PrivateRoute allowedRoles={['organizer']}>
<Participants />
</PrivateRoute>}  />  */}
<Routes >
  {/* <Route path= "/login" element ={<Login/>}  />
  <Route path= "/signup" element ={<Signup/>}  />
  <Route path= "/" element ={<Homepage/>}  /> */}
  <Route path= "/participants" element ={
<Participants />}  />
<Route path="/formlandingpage/:eventId" element={<FormLandingPage />} />
<Route path="/table" element={<Table/>} />
<Route path="/space" element={<Space/>} />
</Routes>
    
=======
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/participants"
          element={
            <PrivateRoute>
              <Participants />
            </PrivateRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <PrivateRoute>
              <Workshops />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <EventsPage />
            </PrivateRoute>
          }
        />
      </Routes>
>>>>>>> 75cc75078602f3a12e2d7f666218947c84302896
    </div>
  );
}

export default App;
