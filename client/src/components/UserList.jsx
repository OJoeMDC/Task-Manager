import './UserList.css'
import User from "./User"
import { useState, useEffect } from 'react';

function UserList({ user, API_URL }) {
    const [users, setUsers] = useState([]);

    const deleteUser = (id) => {
        fetch(`${API_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
         .then(() => setUsers(users.filter(user => user.id !== id)))
        .catch(err => console.error(err));
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
                deleteUser={deleteUser}
                />
            ))}
        </ul>
        </div>
    )
}

export default UserList