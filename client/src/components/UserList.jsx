import './UserList.css'
import User from "./User"
import { useState, useEffect } from 'react';

function UserList({ user, API_URL }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const archiveUser = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/users/${id}/archive`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Failed to archive user');
            return;
        }

        console.log(`User with ID ${id} archived successfully`);
        setUsers(prevUsers =>
            prevUsers.filter(user => user.id !== id)
        );
        }
        catch(err) {
            console.error(err);
            setError('Failed to archive user');
        }
    }

    useEffect(() => {
    fetch(`${API_URL}/api/users`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.error(err));
    }, [API_URL]);
    

    return(
        <div className='userlist'>
        <header>
            <h1>Users</h1>
        </header>
        
        <ul className='list'>
            {users.map((user) => (
                <User
                key={user.id}
                user={user}
                archiveUser={archiveUser}
                />
            ))}
        </ul>
        </div>
    )
}

export default UserList