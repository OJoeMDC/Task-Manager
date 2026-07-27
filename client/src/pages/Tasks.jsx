import TaskList from '../components/TaskList';
import TaskInput from '../components/TaskInput';
import { useState, useEffect } from 'react';
import './Tasks.css';
import useTasks from '../hooks/useTasks';

export default function Tasks({ API_URL, user }) {


  const {
  tasks,
  setTasks,
  editTask,
  viewArchived,
  setViewArchived,
  deleteTask,
  addTask,
  archiveTask,
  restoreTask,
  toggleComplete,
  fetchTasks
} = useTasks(user);

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
          <button className={`button ${viewArchived ? 'toggled' : ''}`} onClick={() => {
                    setViewArchived(!viewArchived); // Toggle between active and archived 
                }}>
                    View Archived
                </button>
          <TaskList 
          tasks={tasks} 
          archiveTask={archiveTask}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
          user={user}/>
        </div>
      </main>
    );
};