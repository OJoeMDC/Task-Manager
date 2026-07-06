import React, { useEffect, useState } from 'react';
import './Admin.css';
import TaskList from '../components/TaskList';

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

            <section className='adminSection'>
                <p>Manage Users</p>
                <button className='button' onClick={fetchAllTasks}>
                    Manage Tasks
                </button>
            </section>

            {activeSection === 'tasks' && (
                <section className='adminSection'>
                    <h2>All Tasks</h2>
                    <TaskList tasks={tasks} />
                </section>
            )}

            {activeSection === 'users' && (
                <section className='adminSection'>
                    <h2>All Users</h2>
                    <p>Feature to manage users will be implemented here.</p>
                </section>
            )}
        </main>
    );
}