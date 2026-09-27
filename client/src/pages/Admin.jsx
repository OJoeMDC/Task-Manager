import React, { useEffect, useState } from 'react';
import './Admin.css';
import TaskList from '../components/TaskList';
import UserList from '../components/UserList';
import useTasks from '../hooks/useTasks';
import userHooks from '../hooks/userHooks';
import SectionButtons from '../components/sectionButtons';
import { useLocation } from 'react-router-dom';


export default function Admin({ user, API_URL, showMessage }) {
    /*
    Admin manages an admin user's dashboard for managing other people and their tasks
    */


    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';
    const [activeSection, setActiveSection] = useState(
        localStorage.getItem('activeSection') || 'users'
    ); // 'users' or 'tasks'

    //imports from useTasks webhook
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

    //imports from userHooks webhook
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

//get all tasks that exist
useEffect(() => {
    if (user) {
        fetchTasks();
    }
}, [user, viewArchived]);

    //if an admin is not logged in, return an error page
    if (!user) {
        return (
            <main className='adminPage'>
                <h1 className='adminTitle'>Admin Only</h1>
                <p>Please log in with an admin account to access this page.</p>
            </main>
        )
    }

    //normal admin page response when admin user is logged in
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
                    adminArchiveTask={adminArchiveTask}
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