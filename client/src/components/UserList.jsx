import './UserList.css'
import User from "./User"
import { useState, useEffect } from 'react';

function UserList({ user, API_URL, viewArchivedUsers }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    //Get users
    const getUsers = async () => {
        try {
            const endpoint = !viewArchivedUsers
                ? `${API_URL}/api/users`
                : `${API_URL}/api/users/all`;

            const res = await fetch(endpoint, {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Failed to fetch users');
            return;
        }

        const data = await res.json();
        setUsers(data);
        
    } catch(err) {
        console.error(err)
        setError('Failed to fetch users');
    }
}


//Archive users
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
         await getUsers();
        }
        catch(err) {
            console.error(err);
            setError('Failed to archive user');
        }
    }

    //Restore User
    const restoreUser = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/users/${id}/restore`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to restore user');
                return;
            }

            console.log(`User with ID ${id} restored successfully`);
            setUsers(prevUsers =>
                prevUsers.filter(user => user.id !== id)
            );

            await getUsers();
        } catch (err) {
            console.error(err);
            setError('Failed to restore user');
        }
    }

    //Delete users
    const deleteUser = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/users/${id}/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if(!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to delete user');
                return;
            }

            console.log(`User with ID ${id} deleted successfully`);
            setUsers(prevUsers =>
                prevUsers.filter(user => user.id !== id)
            );

            await getUsers();
        } catch (err) {
            console.error(err);
            setError('Failed to delete user');
        }
    }


//Update GET USERS when viewArchived changes
useEffect(() => {
    getUsers();
}, [API_URL, viewArchivedUsers]);
    

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
                restoreUser={restoreUser}
                deleteUser={deleteUser}
                />
            ))}
        </ul>
        </div>
    )
}

export default UserList