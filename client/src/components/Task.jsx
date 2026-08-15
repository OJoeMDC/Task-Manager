import { useState} from 'react'
import './Task.css'

export default function Task( { task, archiveTask, toggleComplete, editTask, user, restoreTask, deleteTask } ) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const isAdmin = user && user.role === 'admin';
    const [isLoading, setIsLoading] = useState(null);
    const handleAction = async (actionName, action) => {
        setIsLoading(actionName);
        try{
            await action();
        } finally {
            setIsLoading(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editValue.trim()) return;
        await handleAction('save', () => editTask(task.id, editValue));
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
                                disabled={isLoading !== null}
                                className='save'
                                type='submit'>
                                    {isLoading === 'save' ? 'Saving...' : 'Save'}
                                </button>

                                <button 
                                disabled={isLoading !== null}
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
                            <>
                                <button 
                                disabled={isLoading !== null}
                                className='restore'
                                onClick={() =>
                                    handleAction('restore', () => restoreTask(task.id))
                                }>
                                    {isLoading === 'restore' ? 'Restoring...' : 'Restore'}
                                </button>
                                <button
                                disabled={isLoading !== null}
                                className='delete'
                                onClick={() =>
                                    handleAction('delete', () => deleteTask(task.id))
                                }>
                                    {isLoading === 'delete' ? 'Deleting...' : 'Delete'}
                                </button>
                            </>
                            
                        )}

                        {/* Unarchived task buttons */}
                        {task.archived === 0 && (
                            <>
                                <button
                                    disabled={isLoading !== null} 
                                    type="checkbox" 
                                    className='complete' 
                                    onClick={() => {
                                        handleAction('complete', () => toggleComplete(task.id));
                                    }}>
                                        {isLoading === 'complete' ? 'Toggling...' : 'Complete'}
                                </button>

                                <button
                                    disabled={isLoading !== null}
                                    type="button" 
                                    className='edit'
                                    onClick={() => setIsEditing(true)}>
                                        Edit
                                </button>

                                <button
                                    disabled={isLoading !== null}
                                    className='delete' 
                                    onClick={() => {
                                        handleAction('archive', () => archiveTask(task.id));
                                    }}>
                                        {isLoading === 'archive' ? 'Archiving...' : 'Archive'}
                                </button>
                            </>
                            
                        )}
                    </div>
                </li>
    )
}