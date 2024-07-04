import { useState } from "react";
import "./App.css";
import Participants from "./modules/Participants/pages/Participants";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { Toaster } from "react-hot-toast";
import EventsPage from "./modules/Events/pages/EventsPage";

function App() {
  return (
    <div className="App">
      <Toaster />
      {/* for private routes use Private Route like this
   <Route path= "/participants" element ={<PrivateRoute allowedRoles={['organizer']}>
<Participants />
</PrivateRoute>}  />  */}
      <Routes>
        {/* <Route path= "/login" element ={<Login/>}  />
  <Route path= "/signup" element ={<Signup/>}  />
  <Route path= "/" element ={<Homepage/>}  /> */}
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </div>
  );
}

export default App;
