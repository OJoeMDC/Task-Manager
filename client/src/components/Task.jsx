import { useState} from 'react'
import './Task.css'

function Task( { task, onDelete, onToggle, onEdit, user } ) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const isAdmin = user && user.role === 'admin';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!editValue.trim()) return;
        onEdit(task.id, editValue);
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditValue(task.title);
        setIsEditing(false);
    }

    if (isEditing) {
    return (
        <li key={task.id} className='list-item'>
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
        <li key={task.id} className={`list-item ${task.completed === 1 ? 'completed' : ''}`}>
                   <span>{task.title}</span>
                   {isAdmin && <span>{task.username}</span>}
                    <div className="buttons">
                        <button 
                        type="checkbox" 
                        className='complete' 
                        onClick={() => onToggle(task.id)}>
                            ✓
                        </button>

                        <button 
                        className='edit'
                        onClick={(() => setIsEditing(true))}>
                            Edit
                        </button>

                        <button 
                        className='delete' 
                        onClick={() => onDelete(task.id)}>
                            X
                        </button>
                    </div>
                </li>
    )
}

export default Task