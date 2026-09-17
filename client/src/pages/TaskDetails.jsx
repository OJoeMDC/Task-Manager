import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useTasks from '../hooks/useTasks';
import TaskDetailsCard from '../components/TaskDetailsCard';
import './TaskDetails.css'

function TaskDetails({user, showMessage }) {

    const { id } = useParams();

    // useTasks hooks
    const {
    tasks,
    singleTask,
    setTasks,
    editTask,
    deleteTask,
    archiveTask,
    restoreTask,
    toggleComplete,
    adminToggleComplete,
    adminEditTask,
    adminArchiveTask,
    fetchTasks,
    fetchSingleTask
    } = useTasks(user, showMessage, id);

    const task = singleTask;

    //Fetch the task ID from the URL parameters
    useEffect(() => {
    if (user) {
        fetchSingleTask(id);
    }
    }, [user, id]);

    //Display login if no user is logged in
    if (!user) {
        return (
            <main>
            <h1 className="task-details-title">You are not logged in</h1>
            <p>Please log in to view tasks</p>
            <a href='/login' className='button'>Login</a>
            </main>
        )
    };

    if (!task) {
        return (
            <main>
                <h1 className="task-details-title">Task not found</h1>
                <p>The task you are looking for does not exist.</p>
                <a href='/tasks' className='button'>Back to Tasks</a>
            </main>
        )
    }

  return (
    <div>
        <div>
            <h1 className="task-details-title">Task Details</h1>
            <TaskDetailsCard
            task={task}
            user={user}
            showMessage={showMessage}
            editTask={editTask}
            deleteTask={deleteTask}
            archiveTask={archiveTask}
            toggleComplete={toggleComplete}
            restoreTask={restoreTask}
            adminArchiveTask={adminArchiveTask}
            adminToggleComplete={adminToggleComplete}
            adminEditTask={adminEditTask}
            />
        </div>
        <div>
            <button
            className='button'
            onClick={() => window.history.back()}>
                Back to Tasks
            </button>
        </div>
    </div>
  );
}

export default TaskDetails;