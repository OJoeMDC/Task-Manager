import React from 'react';
import './sectionButtons.css';

export default function SectionButtons({ activeSection, setActiveSection, viewArchived, setViewArchived, viewArchivedUsers, setViewArchivedUsers, user }) {
    const isAdminPage = location.pathname === '/admin'; 

    return (
        <section className='sectionButtons'>


            {/* Show Manage Users button only if the user is an admin and is on the admin page */}
            {user.role === 'admin' && isAdminPage && (
                <button 
                className={`button ${activeSection === 'users' ? 'active' : ''}`}
                onClick={() => {
                    setActiveSection('users');
                    localStorage.setItem('activeSection', 'users'); // Store the active section in localStorage
                }}>
                    Manage Users
                </button>
            )}


            {/* Show Manage Tasks button only if the user is an admin and is on the admin page */}
            {user.role === 'admin' && isAdminPage && (
                <button 
                className={`button ${activeSection === 'tasks' ? 'active' : ''}`}
                onClick={() => {
                    setActiveSection('tasks');
                    localStorage.setItem('activeSection', 'tasks'); // Store the active section in localStorage
                }}>
                    Manage Tasks
                </button>
            )}


            {/* View Archived button for tasks */}
            <button className={`button ${viewArchived ? 'toggled' : ''}`} onClick={() => {
                setViewArchived(!viewArchived); // Toggle between active and archived
                {user.role == 'admin' && isAdminPage && setViewArchivedUsers(!viewArchivedUsers);} //toggle between archived and unarchived users
            }}>
                View Archived
            </button>
        </section>
    );
}