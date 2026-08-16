import { useState, useEffect } from 'react';

export default function userHooks(showMessage) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [viewArchivedUsers, setViewArchivedUsers] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

//Get users
    const getUsers = async () => {
        try {
            const endpoint = !viewArchivedUsers
                ? `${API_URL}/api/users`
                : `${API_URL}/api/users/archived`;

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

//Edit User
const editUser = async (id, newUsername) => {
    try {
        const res = await fetch(`${API_URL}/api/users/${id}/edit`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: newUsername})
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Failed to edit user');
            return;
        }

        const updatedUser = await res.json();
        showMessage(`Successfully edited user ${id}`);

        console.log(`Successfull edited user ${id}`);
         setUsers(prev =>
            prev.map(user =>
                user.id === id ? updatedUser : user
            )
        );

        await getUsers();
    } catch (err) {
        console.error(err)
        setError('Failed to edit username');
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
         showMessage(`User with ID ${id} archived successfully`);

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
            showMessage(`User with ID ${id} restored successfully`);

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
            showMessage(`User with ID ${id} deleted successfully`);

        } catch (err) {
            console.error(err);
            setError('Failed to delete user');
        }
    }

    useEffect(() => {
    getUsers();
}, [API_URL, viewArchivedUsers]);

    return {
        users,
        setUsers,
        getUsers,
        archiveUser,
        restoreUser,
        editUser,
        deleteUser,
        viewArchivedUsers,
        setViewArchivedUsers
    }
}