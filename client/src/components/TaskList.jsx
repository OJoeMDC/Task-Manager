import './TaskList.css'
import Task from "./Task"
import useTasks from '../hooks/useTasks';

function TaskList({ user, tasks, archiveTask, toggleComplete, editTask, restoreTask }) {
    

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
                archiveTask={archiveTask} 
                toggleComplete={toggleComplete}
                editTask={editTask}
                user={user}
                restoreTask={restoreTask}
                />
            ))}
        </ul>
        </div>
    )
}

export default TaskList