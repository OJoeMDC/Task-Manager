import React, { useEffect, useState } from 'react';
import './Admin.css';
import TaskList from '../components/TaskList';
import UserList from '../components/UserList';


export default function Admin({ user, API_URL }) {
    const [tasks, setTasks] = useState([]);
    const [activeSection, setActiveSection] = useState('users'); // 'users' or 'tasks'
    const [viewArchived, setViewArchived] = useState(false); // State to toggle between active and archived tasks

    //Fetch ALL tasks
    const fetchAllTasks = async () => {
        try {
            const endpoint = !viewArchived
                ? `${API_URL}/api/tasks/unarchived`
                : `${API_URL}/api/tasks/all`;


            const res = await fetch(endpoint, {
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

useEffect(() => {
    setViewArchived(false); // Reset to active tasks when switching sections
}, [])

    //Update fetch when View Archived button is clicked
    useEffect(() => {
        fetchAllTasks();
}, [viewArchived]);

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
                <button className='button' onClick={() => {
                    setActiveSection('tasks'); 
                    fetchAllTasks
                    }}>
                    Manage Tasks
                </button>
                <button className={`button ${viewArchived ? 'toggled' : ''}`} onClick={() => {
                    setViewArchived(!viewArchived); // Toggle between active and archived 
                }}>
                    View Archived
                </button>
            </section>

            {activeSection === 'tasks' && (
                <section className='adminSection'>
                    <TaskList tasks={tasks} user={user} onArchive={archiveTask} />
                </section>
            )}

            {activeSection === 'users' && (
                <section className='adminSection'>
                    <UserList API_URL={API_URL} viewArchived={viewArchived} />
                </section>
            )}
        </main>
    );
}