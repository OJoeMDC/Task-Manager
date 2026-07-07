import { useState} from 'react'
import './Task.css'

function User( { user, onDelete, onToggle, onEdit } ) {
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
        <li key={user.id}>
                   <span>{user.username}</span>
                    <div className="buttons">
                        <button 
                        type="checkbox" 
                        className='complete' 
                        onClick={() => onToggle(user.id)}>
                            ✓
                        </button>

                        <button 
                        className='edit'
                        onClick={(() => setIsEditing(true))}>
                            Edit
                        </button>

                        <button 
                        className='delete' 
                        onClick={() => onDelete(user.id)}>
                            X
                        </button>
                    </div>
                </li>

    )
}

export default User