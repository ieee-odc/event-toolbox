import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Button from './core/components/Button/Button'
import Login from './modules/Login/pages/Login'
import SignUp from './modules/Signup/pages/SignUp'


function App() {

  return (
    <Routes >
        <Route path= "/signup" element ={<SignUp/>}  />
        <Route path= "/login" element ={<Login/>}  />
    </Routes>
  )
}

export default App
