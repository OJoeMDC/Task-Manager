import { useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './Task.css'


export default function Task( { task, archiveTask, toggleComplete, editTask, user, restoreTask, deleteTask, adminArchiveTask, adminToggleComplete, adminEditTask } ) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.due_date || '');
    const isAdmin = user && user.role === 'admin';
    const [isLoading, setIsLoading] = useState(null);
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';

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
            ? adminEditTask(task.id, editValue, editDueDate)
            : editTask(task.id, editValue, editDueDate));
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditValue(task.title);
        setEditDueDate(task.due_date || '');
        setIsEditing(false);
    }


    // Task Buttons if currently editing
    if (isEditing) {
    return (
        <li 
        key={task.id}
        className='list-item'
        onClick={() => navigate(`/tasks/${task.id}`)}
        >
                        <form onSubmit={handleSubmit} className='edit-form'>
                            <input 
                                type='text' 
                                value={editValue} 
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => {
                                    if(e.key === 'Escape') handleCancel();
                                }}
                                autoFocus
                            />

                            <input
                            type='date'
                            value={editDueDate}
                            onChange={e => setEditDueDate(e.target.value)}
                            />

                            <div 
                            className="buttons"
                            onClick={e => e.stopPropagation()} // Prevent click from propagating to the li
                            >
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


   // Normal Task Buttons if not editing 
    return (
        <li 
        key={task.id} 
        className={`list-item ${task.completed === 1 ?'completed' : ''} ${task.archived === 1 ? 'archived' : ''} ${isAdminPage ? 'admin-task' : ''}`}
        onClick={() => navigate(`/tasks/${task.id}`)}
        >
                    <span>ID: {task.id}</span>
                   <span><b>Task Name:</b> {task.title}</span>
                   <span
                   className={`${task.due_date && new Date(task.due_date) <= new Date() && task.completed === 0 ? 'overdue' : ''}`}>
                       <b>Due date:</b> {task.due_date || "No due date"}
                   </span>


                   {isAdminPage && <span><b>User:</b> {task.username}</span>}
                    <div 
                    className="buttons"
                    onClick={e => e.stopPropagation()} // Prevent click from propagating to the li
                    >


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

                        {/* Completed task button */}
                        {task.completed === 1 && (
                            <>
                                <button 
                                disabled={isLoading !== null}
                                className='restore'
                                onClick={() =>
                                    handleAction('restore', () => toggleComplete(task.id))
                                }>
                                    {isLoading === 'restore' ? 'Restoring...' : 'Restore'}
                                </button>
                            </>
                        )}

                        {/* Unarchived task buttons */}
                        {task.archived === 0 && task.completed === 0 &&(
                            <>
                                <button
                                    disabled={isLoading !== null} 
                                    type="checkbox" 
                                    className='complete' 
                                    onClick={() => {
                                        handleAction('complete', () => ( isAdmin ? adminToggleComplete(task.id) : toggleComplete(task.id) ));
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
                                        handleAction('archive', () => ( isAdmin ? adminArchiveTask(task.id) : archiveTask(task.id) ));
                                    }}>
                                        {isLoading === 'archive' ? 'Archiving...' : 'Archive'}
                                </button>
                            </>
                            
                        )}
                    </div>
                </li>
    )
}