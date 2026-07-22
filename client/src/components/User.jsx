import { useState} from 'react'
import './Task.css'

export default function User( { user, archiveUser, restoreUser} ) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(user.name);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!editValue.trim()) return;
        onEdit(user.id, editValue);
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditValue(user.name);
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
                            </div>
                        </form>
                </li>
    )
    }

    return (
        <li key={user.id} className={`list-item ${user.archived === 1 ? 'archived' : ''}`}>
                   <span>{user.username}</span>
                    <div className="buttons">
                        {/* Delete button if they're not already archived */}
                        {user.archived === 0 && (
                            <>
                                <button 
                                    className='edit'
                                    onClick={(() => setIsEditing(true))}>
                                        Edit
                                </button>
                                <button 
                                    className='delete' 
                                    onClick={() => archiveUser(user.id)}>
                                        X
                                </button>
                            </>
                        )}

                        {/* Unarchive button if they're archived */}
                        {user.archived === 1 && (
                            <button 
                        className='restore' 
                        onClick={() => restoreUser(user.id)}>
                            Restore
                        </button>
                        )}
                    </div>
                </li>
    )
}