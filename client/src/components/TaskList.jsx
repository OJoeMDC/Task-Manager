import './TaskList.css'
import Task from "./Task"

function TaskList({ tasks, onDelete, onToggle, onEdit }) {
    

    return(
        <div className='tasklist'>
        <header>
            <h1>Tasks</h1>
        </header>
        
        <ul className='list'>
            {tasks.map((task) => (
                <Task
                key={task.id}
                task={task}
                onDelete={onDelete} 
                onToggle={onToggle}
                onEdit={onEdit}
                />
            ))}
        </ul>
        </div>
    )
}

export default TaskList