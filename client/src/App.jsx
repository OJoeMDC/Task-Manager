import './App.css'
import Layout from './Layout'
import { useState } from 'react';

import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Tasks from './pages/Tasks'
import Admin from './pages/Admin'

const API_URL = `${import.meta.env.VITE_API_URL}`


function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user'));
  });


  return(
    <Routes>
      <Route element={<Layout user={user} setUser={setUser} />}>
        <Route path='/' element={<Landing user={user} />} />
        <Route path='/login' element={<Login user={user} setUser={setUser} API_URL={API_URL} />} />
        <Route path='/register' element={<Register setUser={setUser} user={user} API_URL={API_URL} />} />
        <Route path='/profile' element={<Profile user={user} setUser={setUser} API_URL={API_URL} />} />
        <Route path='/tasks' element={<Tasks user={user} API_URL={API_URL} />} />
        <Route path='/admin' element={<Admin user={user} API_URL={API_URL} />} />
      </Route>
    </Routes>
  )
}

export default App