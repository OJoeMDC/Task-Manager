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
import Toast from './components/Toast'

const API_URL = `${import.meta.env.VITE_API_URL}`


function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user'));
  });

  const [message, setMessage] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };


  return(
    <Routes>
      <Route element={<Layout user={user} setUser={setUser} message={message} />}>
        <Route path='/' element={<Landing user={user} />} />
        <Route path='/login' element={<Login user={user} setUser={setUser} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/register' element={<Register setUser={setUser} user={user} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/profile' element={<Profile user={user} setUser={setUser} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/tasks' element={<Tasks user={user} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/admin' element={<Admin user={user} API_URL={API_URL} showMessage={showMessage} />} />
      </Route>
    </Routes>
  )
}

export default App