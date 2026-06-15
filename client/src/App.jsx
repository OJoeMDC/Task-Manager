import './App.css'
import Layout from './Layout'

import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Tasks from './pages/Tasks'

function App() {



  return(
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/tasks' element={<Tasks />} />
      </Route>
    </Routes>
  )
}

export default App