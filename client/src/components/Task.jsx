import { useState} from 'react'
import './Task.css'

export default function Task( { task, archiveTask, toggleComplete, editTask, user, restoreTask } ) {
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
        <li key={task.id} className={`list-item ${task.completed === 1 ? 'completed' : ''} ${task.archived === 1 ? 'archived' : ''}`}>
                   <span>{task.title}</span>
                   {isAdmin && <span>{task.username}</span>}
                    <div className="buttons">
                        {/* Archived task button */}
                        {task.archived === 1 && (
                            <button 
                            className='restore'
                            onClick={() => restoreTask(task.id)}>
                                Restore
                            </button>
                        )}

                        {/* Unarchived task buttons */}
                        {task.archived === 0 && (
                            <>
                                <button 
                                    type="checkbox" 
                                    className='complete' 
                                    onClick={() => toggleComplete(task.id)}>
                                        ✓
                                </button>

                                <button 
                                    className='edit'
                                    onClick={(() => setIsEditing(true))}>
                                        Edit
                                </button>

                                <button 
                                    className='delete' 
                                    onClick={() => archiveTask(task.id)}>
                                        X
                                </button>
                            </>
                            
                        )}
                    </div>
                </li>
    )
}