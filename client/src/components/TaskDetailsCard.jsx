import { useState } from 'react';
import './TaskDetailsCard.css'

export default function TaskDetailsCard({ task, user, showMessage, editTask, deleteTask, archiveTask, toggleComplete, restoreTask, adminArchiveTask, adminToggleComplete, adminEditTask }) {
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.due_date || '');
    const [isLoading, setIsLoading] = useState(null);
    const isAdmin = user && user.role === 'admin';

    console.log(isAdmin ? "Admin user" : "Regular user");

    const handleAction = async (actionName, action) => {
        setIsLoading(actionName);
        try{
            await action();
        } finally {
            setIsLoading(null);
        }
    };

    const handleCancel = () => {
        setEditValue(task.title);
        setEditDueDate(task.due_date || '');
        setEditingField(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editValue.trim()) return;
        await handleAction('save', () => ( isAdmin ? adminEditTask(task.id, editValue, editDueDate) : editTask(task.id, editValue, editDueDate) ));
        setEditingField(null);
    };

    return (
        <div className="task-details-card-container">
        {/* Display the task ID as immutable information */}
            <span className="immutable-info">
                <p className="task-item"><strong>ID:</strong> {task.id}</p>
                <p className="task-item"><strong>Status:</strong> {task.completed === 1 ? 'Completed' : 'Incomplete'}</p>
                <p className="task-item"><strong>Archived:</strong> {task.archived === 1 ? 'Yes' : 'No'}</p>
            </span>

        {/* Display the task details in a card format */}

            {/* Display the task title and allow editing */}
            <div className="task-details-card">
                {editingField === 'title' ? (
                    <div className="detail-field">
                        <strong>Title:</strong>
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={e => {
                                        if(e.key === 'Escape') handleCancel();
                                        if(e.key === 'Enter') handleSubmit(e);
                                    }}
                                    autoFocus
                        />
                    </div>
                    
                ) : (
                    <p 
                    className="task-item"
                    onClick={() => {
                        console.log("Editing title for task ID:", task.id);
                        setEditingField('title')}}>
                            <strong>Title:</strong> {task.title}
                    </p>
                )}


                {/* Display the task due date and allow editing */}
                {editingField === 'due_date' ? (
                    <div className="detail-field">
                        <strong>Due Date:</strong>
                        <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        onKeyDown={e => {
                                    if(e.key === 'Escape') handleCancel();
                                    if(e.key === 'Enter') handleSubmit(e);
                                }}
                                autoFocus
                        />
                    </div>
                ) : (
                    <p className="task-item" onClick={() => {
                        console.log("Editing due date for task ID:", task.id);
                        setEditingField('due_date')}}>
                            <strong>Due Date:</strong> {task.due_date || 'No due date set'}
                    </p>
                )}
            </div>
            <div className="task-details-card-buttons">
                {task.archived === 1 ? (
                    <button className="restore button" onClick={() => restoreTask(task.id)}>
                        Restore
                    </button>
                ) : (
                    <button className="delete button" onClick={() => handleAction('archive', () => ( isAdmin ? adminArchiveTask(task.id) : archiveTask(task.id) ))}>
                        Archive
                    </button>
                )}

                {task.completed === 1 ? (
                    <button className="incomplete button" onClick={() => handleAction('complete', () => ( isAdmin ? adminToggleComplete(task.id) : toggleComplete(task.id) ))}>
                        Mark Incomplete
                    </button>
                ) : (
                    <button className="complete button" onClick={() => handleAction('complete', () => ( isAdmin ? adminToggleComplete(task.id) : toggleComplete(task.id) ))}>
                        Mark Complete
                    </button>
                )}
            </div>
        </div>
    );
}