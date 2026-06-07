import { useState, useEffect } from 'react'
import './App.css'
import TaskList from './TaskList'
import Navbar from './Navbar'
import TaskInput from './TaskInput'

function App() {
  const APU_URL = `${import.meta.env.VITE_API_URL}`

  const [tasks, setTasks] = useState([]);

  // Fetch all Tasks
  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err))
  }, [])


  //Create a new Task
  const addTask = (title) => {
    fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'
    },

    body: JSON.stringify({ title }),
  })
  .then(res => res.json())
  .then(newTask => setTasks([...tasks, newTask]))
  .catch(err => console.error(err));
}

//Delete Task
const deleteTask = (id) => {
  fetch(`${API_URL}/api/tasks/${id}` , {
    method: 'DELETE'
  })
  .then(() => setTasks(tasks.filter(task => task.id !== id)))
  .catch(err => console.error(err));
}

//Complete Task
const toggleComplete = (id) => {
  fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toggle: true }),
  })
  .then( res => res.json())
  .then(updatedTask => setTasks(tasks.map(t => t.id === id ? updatedTask : t)))
  .catch(err => console.error(err))
}

//Edit Task
const editTask = async (id, newTitle) => {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle })
  });
  if (res.ok) {
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
  }
}



  return(
    <div className='app'>
      <Navbar />
      <TaskInput onAdd={addTask}/>
      <TaskList 
      tasks={tasks} 
      onDelete={deleteTask} 
      onToggle={toggleComplete}
      onEdit={editTask}/>
    </div>
  )
}

export default App