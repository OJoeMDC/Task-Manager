import './UserList.css'
import User from "./User"
import { useState, useEffect } from 'react';

function UserList({ onDelete, onToggle, onEdit, user, API_URL }) {
    const [users, setUsers] = useState([]);

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
                onDelete={onDelete} 
                onToggle={onToggle}
                onEdit={onEdit}
                />
            ))}
        </ul>
        </div>
    )
}

export default UserList