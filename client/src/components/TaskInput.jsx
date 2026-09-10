import { useState } from 'react'
import './TaskInput.css'

function TaskInput({ onAdd }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

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
                <input
                type='text'
                placeholder='Enter a new task'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
                <input
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                />
                <button type='submit'>Add</button>
            </form>
        </main>
    )
}

export default TaskInput