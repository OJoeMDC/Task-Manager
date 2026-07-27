import './UserList.css'
import User from "./User"
import { useState, useEffect } from 'react';

function UserList({ user, API_URL, users, setUsers, archiveUser, restoreUser, deleteUser, editUser}) {


    

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
                editUser={editUser}
                deleteUser={deleteUser}
                />
            ))}
        </ul>
        </div>
    )
}

export default UserList