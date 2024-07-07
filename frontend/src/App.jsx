import { useState } from 'react'
import './App.css'
import Participants from './modules/Participants/pages/Participants';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
// import Form from './modules/Form/components/Form';
import FormLandingPage from './modules/Form/pages/FormLandingPage';
import Table from './core/components/Table/Table';
import Page from './modules/Form/pages/Page';
import Base from './modules/Form/pages/base';





function App() {

  return (
    <div className="App">
   {/* for private routes use Private Route like this
   <Route path= "/participants" element ={<PrivateRoute allowedRoles={['organizer']}>
<Participants />
</PrivateRoute>}  />  */}
<Routes >
      {/* <Route path= "/login" element ={<Login/>}  />
      <Route path= "/signup" element ={<Signup/>}  />
      <Route path= "/participantform" element ={<Form/>}  />
      <Route path= "/" element ={<Homepage/>}  /> */}
      <Route path= "/participants" element ={ <Participants />}  />
      {/* Route to your Form component */}
      {/* <Route path="/form" element={<Form/>} /> */}
      {/* <Route path="/showform" element={<Form/>} /> */}
      <Route path="/formlandingpage/:eventId" element={<FormLandingPage />} />
      <Route path="/table" element={<Table/>} />
      <Route path="/aaa" element={<Page/>} /> 
      <Route path="/base" element={<Base/>} /> 





</Routes>
    
    </div>
  )
}

export default App
