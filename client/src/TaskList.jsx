import { useState } from "react";
import './TaskList.css'
import TaskInput from "./TaskInput";

function TaskList({ tasks, onDelete, onToggle }) {

    return(
        <div className='tasklist'>
        <header>
            <h1>Tasks</h1>
        </header>
        
        <ul className='list'>
            {tasks.map((task) => (
                <li key={task.id} className={`list-item ${task.completed === 1 ? 'completed' : ''}`}>
                    <span>{task.title}</span>
                    <div className="buttons">
                        <button type="checkbox" className='complete' onClick={() => onToggle(task.id)}>✓</button>
                        <button className='edit'>Edit</button>
                        <button className='delete' onClick={() => onDelete(task.id)}>X</button>
                    </div>
                </li>
            ))}
        </ul>
        </div>
    )
}

export default TaskList