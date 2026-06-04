import { useState } from "react";
import './TaskList.css'
import TaskInput from "./TaskInput";

function TaskList({ tasks }) {

    return(
        <div className='tasklist'>
        <header>
            <h1>Tasks</h1>
        </header>
        
        <ul className='list'>
            {tasks.map((task) => (
                <li key={task.id} className='list-item'>
                    {task.title}
                    <div className="buttons">
                        <button className='delete'>X</button>
                        <button className='edit'>Edit</button>
                    </div>
                </li>
            ))}
        </ul>
        </div>
    )
}

export default TaskList