import { useState} from 'react'
import './Task.css'
import { Check, Pencil, Trash2, Archive, RotateCcw } from "lucide-react";

export default function User( { user, archiveUser, restoreUser, deleteUser, editUser } ) {
    /*
    User defines actions to take on a user in the userlist of the admin dashboard

    this is a component to be placed on a page, notably in the userlist on the admin dashboard
    */



    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(user.username);
    const [newRole, setNewRole] = useState(user.role);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!editValue.trim()) return;
        editUser(user.id, editValue, newRole);
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditValue(user.username);
        setIsEditing(false);
    }


    if (isEditing) {
    return (
        <li key={user.id} className='list-item'>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type='text' 
                                value={editValue} 
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => {
                                    if(e.key === 'Escape') handleCancel();
                                }}
                                autoFocus
                            />

                            <div className="buttons">

                                <button 
                                className='save'
                                type='submit'>
                                    Save
                                </button>

                                <button 
                                className='cancel' 
                                onClick={handleCancel}>
                                    Cancel
                                </button>

                                <button
                                className='role'
                                onClick={() => {
                                    setNewRole(user.role === 'user' ? 'admin' : 'user');
                                }}>
                                    {user.role === 'user' ? 'Make Admin' : 'Make User'}

                                </button>

                            </div>
                        </form>
                </li>
    )
    }

    return (
        <li key={user.id} className={`
                user-list-item 
                ${user.archived === 1 ? 'archived' : ''}
            `}>
                <div className='user-info'>
                    <span className='task-title'>{user.username}</span>
                   <span>Role: {user.role}</span>
                </div>
                   
                    <div className="buttons">
                        {/* Delete button if they're not already archived */}
                        {user.archived === 0 && (
                            <>
                                <button 
                                    className='edit'
                                    onClick={(() => setIsEditing(true))}>
                                        <span className="button-icon">
                                            <Pencil size={20} />
                                        </span>
                                        <p className="button-text">
                                            Edit
                                        </p>
                                </button>
                                <button 
                                    className='delete' 
                                    onClick={() => archiveUser(user.id)}>
                                        <span className="button-icon">
                                            <Archive size={20} />
                                        </span>
                                        <p className="button-text">
                                            Archive
                                        </p>
                                </button>
                            </>
                        )}

                        {/* Unarchive button if they're archived */}
                        {user.archived === 1 && (
                            <>
                            <button 
                                className='restore' 
                                onClick={() => restoreUser(user.id)}>
                                    <span className="button-icon">
                                        <RotateCcw size={20} />
                                    </span>
                                    <span className="button-text">
                                        Restore
                                    </span>
                                </button>

                                <button
                                    className='delete'
                                    onClick={() => deleteUser(user.id)}>
                                    <span className="button-icon">
                                        <Trash2 size={20} />
                                    </span>
                                    <span className="button-text">
                                        DELETE
                                    </span>
                                </button>
                            </>
                            
                        )}
                    </div>
                </li>
    )
}