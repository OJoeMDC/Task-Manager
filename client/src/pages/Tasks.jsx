import TaskList from '../components/TaskList';
import TaskInput from '../components/TaskInput';
import { useState, useEffect } from 'react';
import './Tasks.css';
import useTasks from '../hooks/useTasks';
import SectionButtons from '../components/sectionButtons';

export default function Tasks({ API_URL, user, showMessage }) {

  /*
  The Tasks function defines an individual user's tasks dashboard
  */

  //imports task functions from useTasks
  const {
  tasks,
  setTasks,
  editTask,
  viewArchived,
  setViewArchived,
  viewCompleted,
  setViewCompleted,
  deleteTask,
  addTask,
  archiveTask,
  restoreTask,
  toggleComplete,
  fetchTasks
} = useTasks(user, showMessage);


//grabs the user's tasks from server
useEffect(() => {
  if (user) {
    fetchTasks();
  }
}, [user, viewArchived, viewCompleted]);



//returns an error page when no user is logged in
if (!user) {
  return (
    <main>
      <h1>You are not logged in</h1>
      <p>Please log in to view tasks</p>
      <a href='/login' className='button'>Login</a>
    </main>
  )
};


//normal page for users
    return ( 
      <main>
        <h1>{user.username}'s Tasks</h1>
        <div className='tasks'>
          <TaskInput onAdd={addTask}/>


          <SectionButtons
            viewArchived={viewArchived}
            setViewArchived={setViewArchived}
            viewCompleted={viewCompleted}
            setViewCompleted={setViewCompleted}
            user={user}
          />

          <TaskList 
          tasks={tasks} 
          archiveTask={archiveTask}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
          restoreTask={restoreTask}
          user={user}/>
        </div>
      </main>
    );
};