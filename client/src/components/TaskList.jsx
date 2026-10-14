import './TaskList.css'
import Task from "./Task"
import useTasks from '../hooks/useTasks';

function TaskList({ user, tasks, archiveTask, toggleComplete, editTask, restoreTask, deleteTask, adminArchiveTask, adminToggleComplete, adminEditTask, idVisibility , viewArchived, viewCompleted}) {
    /*
    Tasklist takes care of the lists of tasks

    this is a component to be placed on a page
    */
    

    return(
        <div className='tasklist'>
        <header className='tasklist-title'>
            {viewArchived && <h1>Archived Tasks</h1>}
            {viewCompleted && <h1>Completed Tasks</h1>}
            {!viewArchived && !viewCompleted && <h1>Tasks</h1>}
        </header>
        
        <ul className='list'>
            {tasks.length === 0 ? (
                <p>No tasks to display</p>
            ) : (
                tasks.map((task) => (
                    <Task
                    key={task.id}
                    task={task}
                    archiveTask={archiveTask}
                    adminArchiveTask={adminArchiveTask}
                    adminToggleComplete={adminToggleComplete}
                    adminEditTask={adminEditTask}
                    deleteTask={deleteTask}
                    toggleComplete={toggleComplete}
                    editTask={editTask}
                    user={user}
                    restoreTask={restoreTask}
                    idVisibility={idVisibility}
                    />
                ))
            )}
        </ul>
        </div>
    )
}

export default TaskList