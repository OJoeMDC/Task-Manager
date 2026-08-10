import React, { useEffect, useState } from 'react';
import './Admin.css';
import TaskList from '../components/TaskList';
import UserList from '../components/UserList';
import useTasks from '../hooks/useTasks';
import userHooks from '../hooks/userHooks';


export default function Admin({ user, API_URL, showMessage }) {
    const [activeSection, setActiveSection] = useState('users'); // 'users' or 'tasks'

    const {
        tasks,
        editTask,
        setTasks,
        viewArchived,
        setViewArchived,
        archiveTask,
        adminArchiveTask,
        deleteTask,
        restoreTask,
        toggleComplete,
        fetchTasks
    } = useTasks(user, showMessage);

    const {
        users,
        setUsers,
        getUsers,
        archiveUser,
        restoreUser,
        editUser,
        deleteUser,
        viewArchivedUsers,
        setViewArchivedUsers
    } = userHooks();

    //Update GET USERS when viewArchived changes
useEffect(() => {
    getUsers();
}, [API_URL, viewArchivedUsers]);

useEffect(() => {
    if (user) {
        fetchTasks();
    }
}, [user, viewArchived]);


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
                    }}>
                    Manage Tasks
                </button>
                <button className={`button ${viewArchived ? 'toggled' : ''}`} onClick={() => {
                    setViewArchived(!viewArchived); // Toggle between active and archived
                    setViewArchivedUsers(!viewArchivedUsers); //toggle between archived and unarchived users
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
                    deleteTask={deleteTask}
                        />
                </section>
            )}

            {activeSection === 'users' && (
                <section className='adminSection'>
                    <UserList 
                    API_URL={API_URL} 
                    user={user} 
                    viewArchivedUsers={viewArchivedUsers}
                    archiveUser={archiveUser}
                    restoreUser={restoreUser}
                    deleteUser={deleteUser} 
                    editUser={editUser}
                    users={users}
                    setUsers={setUsers}/>
                </section>
            )}
        </main>
    );
}