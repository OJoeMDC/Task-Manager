import { useState } from 'react';
import './TaskDetailsCard.css'
import useTasks from '../hooks/useTasks';

export default function TaskDetailsCard({ task, user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.due_date || '');
    const isAdmin = user && user.role === 'admin';

    const handleCancel = () => {
        setEditValue(task.title);
        setEditDueDate(task.due_date || '');
        setIsEditing(false);
        setEditingField(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editValue.trim()) return;
        await handleAction('save', () => isAdminPage
            ? adminEditTask(task.id, editValue, editDueDate)
            : editTask(task.id, editValue, editDueDate));
        setIsEditing(false);
    }


    const {
      tasks,
      setTasks,
      editTask,
      viewArchived,
      setViewArchived,
      viewCompleted,
      setViewCompleted,
      deleteTask,
      addTask,
      archiveTask,
      restoreTask,
      toggleComplete,
      fetchTasks
    } = useTasks(user);


    //Buttons if editing
    if (isEditing) {
    return(
        <div className="task-details-card-container">
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

                <button type='submit'>Save</button>
                <button type='button' onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}

    //Buttons it not editing
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
                <button className="delete button" onClick={() => deleteTask(task.id)}>
                    Archive
                </button>
                <button className="complete button" onClick={() => archiveTask(task.id)}>
                    Mark Complete
                </button>
            </div>
        </div>
    );
}