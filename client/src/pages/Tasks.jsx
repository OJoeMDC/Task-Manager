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
  addTask,
  archiveTask,
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
          <TaskList 
          tasks={tasks} 
          archiveTask={archiveTask} 
          toggleComplete={toggleComplete}
          editTask={editTask}
          user={user}/>
        </div>
      </main>
    );
};