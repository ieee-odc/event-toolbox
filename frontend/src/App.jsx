import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './core/components/Button/Button'
import Login from './view/pages/Login/Login'
import Participations from './view/pages/Participations/Participations'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
    <Participations/>
   </div>
  )
}

export default App
