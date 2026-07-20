import React, { useEffect, useState } from 'react';
import './Admin.css';
import TaskList from '../components/TaskList';
import UserList from '../components/UserList';


export default function Admin({ user, API_URL }) {
    const [tasks, setTasks] = useState([]);
    const [activeSection, setActiveSection] = useState('users'); // 'users' or 'tasks'

    //Fetch ALL tasks
    const fetchAllTasks = async () => {
        setActiveSection('tasks'); // Switch to tasks section when fetching tasks
        try {
            const res = await fetch(`${API_URL}/api/tasks/all`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error(err);
        }
    };


    //Archive Task
const archiveTask = (id) => {
  fetch(`${API_URL}/api/tasks/${id}` , {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
  .then(() => setTasks(tasks.filter(task => task.id !== id)))
  .catch(err => console.error(err));
};


    if (!user) {
        return (
            <main className='adminPage'>
                <h1 className='adminTitle'>Admin Only</h1>
                <p>Please log in with an admin account to access this page.</p>
            </main>
        )
    }


    return (
        <main className='adminPage'>
            <h1 className='adminTitle'>Admin Dashboard</h1>
            <p>Welcome, {user?.username}</p>
            <p>Your role is: {user?.role}</p>

            <section className='adminButtons'>
                <button className='button' onClick={() => setActiveSection('users')}>
                    Manage Users
                </button>
                <button className='button' onClick={fetchAllTasks}>
                    Manage Tasks
                </button>
            </section>

            {activeSection === 'tasks' && (
                <section className='adminSection'>
                    <TaskList tasks={tasks} user={user} onArchive={archiveTask} />
                </section>
            )}

            {activeSection === 'users' && (
                <section className='adminSection'>
                    <UserList API_URL={API_URL} />
                </section>
            )}
        </main>
    );
}