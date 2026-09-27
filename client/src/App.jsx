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
import TaskDetails from './pages/TaskDetails'

const API_URL = `${import.meta.env.VITE_API_URL}`


function App() {
  /*
  App Bundles everything together
  */

  //Get the user upon loading the website from local storage
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user'));
  });


  //Toast msg variables
  const [message, setMessage] = useState('');
  const [toastKey, setToastkey] = useState(false);

  //Set the message and a timer for a toast when an action happens
  //The key ensures that a new toast is spawned for every action
  const showMessage = (msg) => {

    setMessage(msg);
    setToastkey(key => !key);

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  //Routes contains every page so the layouts can be applied to all pages at once
  return(
    <Routes>
      <Route element={<Layout user={user} setUser={setUser} message={message} toastKey={toastKey} />}>
        <Route path='/' element={<Landing user={user} />} />
        <Route path='/login' element={<Login user={user} setUser={setUser} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/register' element={<Register setUser={setUser} user={user} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/profile' element={<Profile user={user} setUser={setUser} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/tasks' element={<Tasks user={user} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/admin' element={<Admin user={user} API_URL={API_URL} showMessage={showMessage} />} />
        <Route path='/tasks/:id' element={<TaskDetails user={user} API_URL={API_URL} showMessage={showMessage} />} />
      </Route>
    </Routes>
  )
}

export default App