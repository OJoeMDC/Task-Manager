import React, { useEffect, useState } from 'react';
import './Admin.css';
import TaskList from '../components/TaskList';
import UserList from '../components/UserList';
import useTasks from '../hooks/useTasks';
import userHooks from '../hooks/userHooks';
import SectionButtons from '../components/sectionButtons';
import { useLocation } from 'react-router-dom';


export default function Admin({ user, API_URL, showMessage }) {
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';
    const [activeSection, setActiveSection] = useState(
        localStorage.getItem('activeSection') || 'users'
    ); // 'users' or 'tasks'

    const {
        tasks,
        editTask,
        setTasks,
        viewArchived,
        setViewArchived,
        viewCompleted,
        setViewCompleted,
        archiveTask,
        adminArchiveTask,
        deleteTask,
        restoreTask,
        toggleComplete,
        adminToggleComplete,
        adminEditTask,
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
    } = userHooks(showMessage);

    //Update GET USERS when viewArchived changes
useEffect(() => {
    getUsers();
}, [API_URL, viewArchivedUsers, viewArchived, viewCompleted]);

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

            <SectionButtons
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                viewArchived={viewArchived}
                setViewArchived={setViewArchived}
                viewArchivedUsers={viewArchivedUsers}
                setViewArchivedUsers={setViewArchivedUsers}
                viewCompleted={viewCompleted}
                setViewCompleted={setViewCompleted}
                user={user}
            />

            {activeSection === 'tasks' && (
                <section className='adminSection'>
                    <TaskList
                    user={user}
                    tasks={tasks}
                    archiveTask={adminArchiveTask}
                    toggleComplete={toggleComplete}
                    adminToggleComplete={adminToggleComplete}
                    adminEditTask={adminEditTask}
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