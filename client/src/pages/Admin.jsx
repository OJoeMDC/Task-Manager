import React, { useEffect, useState } from 'react';
import './Admin.css';
import TaskList from '../components/TaskList';
import UserList from '../components/UserList';
import useTasks from '../hooks/useTasks';


export default function Admin({ user, API_URL }) {
    const [activeSection, setActiveSection] = useState('users'); // 'users' or 'tasks'
    const [viewArchived, setViewArchived] = useState(false); // State to toggle between active and archived tasks

    const {
        tasks,
        editTask,
        setTasks,
        archiveTask,
        adminArchiveTask,
        restoreTask,
        toggleComplete
    } = useTasks(user);

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
  if (activeSection === 'tasks') {
    fetchAllTasks();
  }
}, [viewArchived, activeSection, archiveTask, restoreTask, editTask]);


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
                    fetchAllTasks(); // Fetch tasks when switching to the tasks section
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
                    <TaskList
                    user={user}
                    tasks={tasks}
                    archiveTask={adminArchiveTask}
                     toggleComplete={toggleComplete}
                      editTask={editTask}
                       restoreTask={restoreTask}
                        />
                </section>
            )}

            {activeSection === 'users' && (
                <section className='adminSection'>
                    <UserList API_URL={API_URL} viewArchived={viewArchived} user={user} />
                </section>
            )}
        </main>
    );
}