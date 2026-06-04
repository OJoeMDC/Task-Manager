import { useState } from 'react'
import './TaskInput.css'

function TaskInput({ onAdd }) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!title.trim()) return
        onAdd(title)
        setTitle('')
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
                <button type='submit'>Add</button>
            </form>
        </main>
    )
}

export default TaskInput