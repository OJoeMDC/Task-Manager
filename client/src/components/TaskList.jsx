import './TaskList.css'
import Task from "./Task"
import { useState, useRef } from 'react';

function TaskList({ user, tasks, setTasks, archiveTask, toggleComplete, editTask, restoreTask, deleteTask, adminArchiveTask, adminToggleComplete, adminEditTask, idVisibility , viewArchived, viewCompleted, handleUpdateList}) {
    /*
    Tasklist takes care of the lists of tasks

    this is a component to be placed on a page
    */

    const [draggedTask, setDraggedTask] = useState(null);
    const originalTasks = useRef(null);
    const startPosition = useRef(null);
    const wasDragged = useRef(false);

    const handleDragStart = (e, taskId) => {
        startPosition.current = { x: e.clientX, y: e.clientY };
        wasDragged.current = false;
         e.currentTarget.setPointerCapture(e.pointerId);
        console.log(taskId)
        originalTasks.current = [...tasks];
        setDraggedTask(taskId);
    };

    function swapTasks(a, b) {
        let temp = tasks[b]
        const newTasks = [...tasks]
        newTasks[b] = tasks[a]
        newTasks[a] = temp

        setTasks(newTasks)
    };

     const handleSwap = (b) => {
        const indexB = tasks.findIndex(tasks => tasks.id === b);
        const indexA = tasks.findIndex(tasks => tasks.id === draggedTask)
        console.log(`indexB ${indexB}`)
        console.log(`indexA ${indexA}`)
        if (indexA != indexB) {
            swapTasks(indexB, indexA)
        }
    };

    const handleDragEnd = async () => {
        setDraggedTask(null);
        console.log("POINTER RELEASED");

        try {
            await handleUpdateList(tasks);
        } catch (err) {
            setTasks(originalTasks.current);
            console.error("Failed to update task list order");
        }
    };

    

    return(
        <div className='tasklist'>
        <header className='tasklist-header'>
            {viewArchived && <h1>Archived Tasks</h1>}
            {viewCompleted && <h1>Completed Tasks</h1>}
            {!viewArchived && !viewCompleted && <h1 className='tasklist-title'>Tasks</h1>}
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
                    swapTasks={swapTasks}
                    draggedTask={draggedTask}
                    setDraggedTask={setDraggedTask}
                    handleSwap={handleSwap}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    startPosition={startPosition}
                    wasDragged={wasDragged}
                    />
                ))
            )}
        </ul>
        </div>
    )
}

export default TaskList