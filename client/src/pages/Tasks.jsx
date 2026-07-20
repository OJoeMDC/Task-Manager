import TaskList from '../components/TaskList';
import TaskInput from '../components/TaskInput';
import { useState, useEffect } from 'react';
import './Tasks.css';

export default function Tasks({ API_URL, user }) {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');


   // Fetch user tasks
  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    },
    )
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err))
  }, [API_URL, user]);


  //Create a new Task
  const addTask = (title) => {
    console.log("adding task", title, user);
    
    if (!user) return;

    fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },

    body: JSON.stringify({ title }),
  })
  .then(res => res.json())
  .then(newTask => setTasks(prev => [...tasks, newTask]))
  .catch(err => console.error(err));
};

//Archive Task
const archiveTask = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/tasks/${id}` , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ archived: 1 })
  });

  if (!res.ok) {
    const data = await res.json();
    setError(data.error || 'Failed to archive task. res not ok');
    return;
  }

  setTasks(prevTasks => 
    prevTasks.filter(task => task.id !== id)
  );
  } catch(err) {
    console.error(err);
    setError('Failed to archive task');
  }
  
};

//Complete Task
const toggleComplete = (id) => {
  fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
     },
    body: JSON.stringify({ toggle: true }),
  })
  .then( res => res.json())
  .then(updatedTask => setTasks(tasks.map(t => t.id === id ? updatedTask : t)))
  .catch(err => console.error(err))
};

//Edit Task
const editTask = async (id, newTitle) => {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
     },
    body: JSON.stringify({ title: newTitle })
  });
  if (res.ok) {
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  }
};

if (!user) {
  return (
    <main>
      <h1>You are not logged in</h1>
      <p>Please log in to view tasks</p>
      <a href='/login' className='button'>Login</a>
    </main>
  )
};
    return ( 
      <main>
        <h1>{user.username}'s Tasks</h1>
        <div className='tasks'>
          <TaskInput onAdd={addTask}/>
          <TaskList 
          tasks={tasks} 
          onArchive={archiveTask} 
          onToggle={toggleComplete}
          onEdit={editTask}
          user={user}/>
        </div>
      </main>
    );
};