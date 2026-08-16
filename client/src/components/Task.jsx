import { useState} from 'react'
import { useLocation } from 'react-router-dom';
import './Task.css'


export default function Task( { task, archiveTask, toggleComplete, editTask, user, restoreTask, deleteTask, adminArchiveTask, adminToggleComplete, adminEditTask } ) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const isAdmin = user && user.role === 'admin';
    const [isLoading, setIsLoading] = useState(null);
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';
    console.log(isAdminPage);
    console.log("pathname:", location.pathname);

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
        await handleAction('save', () => isAdminPage
            ? adminEditTask(task.id, editValue)
            : editTask(task.id, editValue));
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
                   <span>Task Name: {task.title}</span>
                   {isAdminPage && <span>User: {task.username}</span>}
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
                                        handleAction('complete', () => ( isAdminPage ? adminToggleComplete(task.id) : toggleComplete(task.id) ));
                                    }}>
                                        {isLoading === 'complete' ? 'Toggling...' : 'Complete'}
                                </button>

                                <button
                                    disabled={isLoading !== null}
                                    type="button" 
                                    className='edit'
                                    onClick={() => {
                                        console.log("Edit clicked for task ID:", task.id);
                                        setIsEditing(true)}}>
                                        Edit
                                </button>

                                <button
                                    disabled={isLoading !== null}
                                    className='delete' 
                                    onClick={() => {
                                        handleAction('archive', () => ( isAdminPage ? adminArchiveTask(task.id) : archiveTask(task.id) ));
                                    }}>
                                        {isLoading === 'archive' ? 'Archiving...' : 'Archive'}
                                </button>
                            </>
                            
                        )}
                    </div>
                </li>
    )
}