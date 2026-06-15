import { useState, useEffect } from 'react'
import './App.css'
import TaskList from './TaskList'
import Navbar from './Navbar'
import TaskInput from './TaskInput'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Tasks from './pages/Tasks'

function App() {



  return(
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/tasks' element=
      {<Tasks />
      } />
    </Routes>
  )
}

export default App