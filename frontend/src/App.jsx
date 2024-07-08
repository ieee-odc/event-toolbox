import { useState } from 'react'
import './App.css'
import Participants from './modules/Participants/pages/Participants';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';

import { Toaster } from 'react-hot-toast';
import Table from './core/components/Table/Table';
import FormLandingPage from './modules/Form/pages/FormLandingPage';


function App() {

  return (
    <div className="App">
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
</Routes>
    
    </div>
  )
}

export default App
