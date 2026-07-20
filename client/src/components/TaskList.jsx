import './TaskList.css'
import Task from "./Task"

function TaskList({ tasks, onArchive, onToggle, onEdit, user }) {
    

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
                onArchive={onArchive} 
                onToggle={onToggle}
                onEdit={onEdit}
                user={user}
                />
            ))}
        </ul>
        </div>
    )
}

export default TaskList