import { useState } from 'react'
import './TaskInput.css'
import { Plus, Trash2 } from "lucide-react";

function TaskInput({ onAdd }) {
    /*
    Task Input handles the creation of a new task on the user's dashboard

    this is a component to be placed on a page
    */
   


    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    //handles submitting the task form
    const handleSubmit = (e) => {
        e.preventDefault()
        if(!title.trim()) return
        onAdd({ title, dueDate })
        setTitle('')
        setDueDate('')
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className='task-form'>
                <span className='title-wrapper'>
                    <input
                        className='task-name-input'
                        type='text'
                        placeholder='Enter a new task'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </span>
                <span className='date-wrapper'>
                    {!dueDate && (
                        <span className='date-placeholder'>
                            Select a date
                        </span>
                    )}
                    <input
                    type='date'
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    />
                </span>
                
                <article className='task-form-buttons'>
                    <button type='submit' className='button add-button'>
                        <span className="button-icon">
                            <Plus size={20} />
                        </span>
                        <span className="button-text">
                            Add Task
                        </span>
                    </button>
                    <button type='reset' className='button clear-button'
                    onClick={() => {
                        setTitle('')
                        setDueDate('')
                    }}>
                        <span className="button-icon">
                            <Trash2 size={20} />
                        </span>
                        <span className="button-text">
                            Clear
                        </span>
                    </button>
                </article>
            </form>
        </main>
    )
}

export default TaskInput