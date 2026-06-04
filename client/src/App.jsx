import { useState, useEffect } from 'react'
import './App.css'
import TaskList from './TaskList'
import Navbar from './Navbar'
import TaskInput from './TaskInput'

function App() {
  const [tasks, setTasks] = useState([]);

  // Fetch all Tasks
  useEffect(() => {
    fetch('http://localhost:3000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err))
  }, [])


  //Create a new Task
  const addTask = (title) => {
    fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'
    },

    body: JSON.stringify({ title }),
  })
  .then(res => res.json())
  .then(newTask => setTasks([...tasks, newTask]))
  .catch(err => console.error(err));
}


  return(
    <div className='app'>
      <Navbar />
      <TaskInput onAdd={addTask}/>
      <TaskList tasks={tasks}/>
    </div>
  )
}

export default App