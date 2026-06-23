import './App.css'
import Layout from './Layout'
import { useState } from 'react';

import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Tasks from './pages/Tasks'

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user'));
  });


  return(
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login user={user} setUser={setUser}/>} />
        <Route path='/register' element={<Register setUser={setUser} user={user} />} />
        <Route path='/profile' element={<Profile user={user} setUser={setUser} />} />
        <Route path='/tasks' element={<Tasks user={user} />} />
      </Route>
    </Routes>
  )
}

export default App