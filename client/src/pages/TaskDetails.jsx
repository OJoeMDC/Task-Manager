import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useTasks from '../hooks/useTasks';
import Task from '../components/Task';
import TaskDetailsCard from '../components/TaskDetailsCard';
import './TaskDetails.css'

function TaskDetails({ API_URL, user, showMessage }) {

    const { id } = useParams();

    // useTasks hooks
    const {
    tasks,
    setTasks,
    editTask,
    viewArchived,
    setViewArchived,
    viewCompleted,
    setViewCompleted,
    deleteTask,
    addTask,
    archiveTask,
    restoreTask,
    toggleComplete,
    fetchTasks
    } = useTasks(user, showMessage);

    //Fetch the task ID from the URL parameters
    useEffect(() => {
    if (user) {
        fetchTasks();
    }
    }, [user, viewArchived, viewCompleted]);

    //Display login if no user is logged in
    if (!user) {
        return (
            <main>
            <h1>You are not logged in</h1>
            <p>Please log in to view tasks</p>
            <a href='/login' className='button'>Login</a>
            </main>
        )
    };

    const task = tasks.find((task) => task.id === parseInt(id));

    if (!task) {
        return (
            <main>
                <h1>Task not found</h1>
                <p>The task you are looking for does not exist.</p>
                <a href='/tasks' className='button'>Back to Tasks</a>
            </main>
        )
    }

  return (
    <div>
        <h1>Task Details</h1>
            <TaskDetailsCard task={task} user={user} />
    </div>
  );
}

export default TaskDetails;