import TaskList from '../TaskList'
import TaskInput from '../TaskInput'
import { useState, useEffect } from 'react'
import './Tasks.css'

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const API_URL = `${import.meta.env.VITE_API_URL}`
   // Fetch all Tasks

   
  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err))
  }, [API_URL])


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
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  }
}

console.log(API_URL);

    return ( 
    <div className='tasks'>
        <TaskInput onAdd={addTask}/>
        <TaskList 
        tasks={tasks} 
        onDelete={deleteTask} 
        onToggle={toggleComplete}
        onEdit={editTask}/>
    </div>
    );
};