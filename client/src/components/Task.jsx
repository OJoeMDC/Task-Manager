import { useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './Task.css'
import { Check, Pencil, Trash2, Archive, RotateCcw } from "lucide-react";


{/* 
<Trash2 size={20} /> */}


export default function Task( { task, archiveTask, toggleComplete, editTask, user, restoreTask, deleteTask, adminArchiveTask, adminToggleComplete, adminEditTask, idVisibility } ) {
    /*
    Task handles what buttons an individual task has in a tasklist

    this is a component to be placed in tasklist, but is able to be called elsewhere
    */

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
        className={`
            list-item
            ${task.completed === 1 ?'completed' : ''} 
            ${task.archived === 1 ? 'archived' : ''} 
            ${isAdminPage ? 'admin-task' : ''} 
            ${idVisibility ? '' : 'hide-id'}
            `}
        onClick={() => navigate(`/tasks/${task.id}`)}
        >
                    <div className='task-info'>
                        <span className='task-title'>{task.title}</span>
                        <span
                        className={`
                            task-due
                        ${task.due_date && new Date(task.due_date) <= new Date() && task.completed === 0 ? 'overdue' : ''}`
                        }>
                        {task.due_date || "No due date"}
                        </span>
                    </div>


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
                                    <p className="button-icon">
                                        <RotateCcw size={20} />
                                    </p>
                                    <p className="button-text">
                                        {isLoading === 'restore' ? 'Restoring...' : 'Restore'}
                                    </p>
                                </button>
                                <button
                                disabled={isLoading !== null}
                                className='delete'
                                onClick={() =>
                                    handleAction('delete', () => deleteTask(task.id))
                                }>
                                    <p className="button-icon">
                                        <Trash2 size={20} />
                                    </p>
                                    <p className="button-text">
                                    {isLoading === 'delete' ? 'Deleting...' : 'Delete'}
                                    </p>
                                </button>
                            </>
                            
                        )}

                        {/* Completed task button */}
                        {task.completed === 1 && (
                            <>
                                <button 
                                disabled={isLoading !== null}
                                className='restore'
                                onClick={() => {
                                    handleAction('restore', () => ( isAdmin && isAdminPage ? adminToggleComplete(task.id) : toggleComplete(task.id) ));
                                }}>
                                    <span className="button-icon">
                                        <RotateCcw size={20} />
                                    </span>
                                    <span className="button-text">
                                        {isLoading === 'restore' ? 'Restoring...' : 'Restore'}
                                    </span>
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
                                        handleAction('complete', () => ( isAdmin && isAdminPage ? adminToggleComplete(task.id) : toggleComplete(task.id) ));
                                    }}>
                                        <span className="button-icon">
                                            <Check size={20} />
                                        </span>
                                        <span className="button-text">
                                            {isLoading === 'complete' ? 'Toggling...' : 'Complete'}
                                        </span>
                                </button>

                                <button
                                    disabled={isLoading !== null}
                                    type="button" 
                                    className='edit'
                                    onClick={() => {
                                        console.log("Edit clicked for task ID:", task.id);
                                        setIsEditing(true)}}>
                                            <span className="button-icon">
                                                <Pencil size={20} />
                                            </span>
                                            <span className="button-text">
                                                Edit
                                            </span>
                                </button>

                                <button
                                    disabled={isLoading !== null}
                                    className='delete' 
                                    onClick={() => {
                                        handleAction('archive', () => ( isAdmin ? adminArchiveTask(task.id) : archiveTask(task.id) ));
                                    }}>
                                        <span className="button-icon">
                                            <Archive size={20} />
                                        </span>
                                        <span className="button-text">
                                        {isLoading === 'archive' ? 'Archiving...' : 'Archive'}
                                        </span>
                                </button>
                            </>
                            
                        )}
                    </div>
                    <div className='task-id'>
                        {idVisibility && <span className="task-id">ID: {task.id}</span>}
                    </div>
                </li>
    )
}