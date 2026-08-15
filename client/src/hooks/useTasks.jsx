import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useTasks(user, showMessage) {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [viewArchived, setViewArchived] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin'; 


    // Fetch user tasks
    const fetchTasks = async () => {
        try {
            let endpoint;

                if (user.role === 'admin' && isAdminPage) {
                    endpoint = viewArchived
                        ? `${API_URL}/api/tasks/all/all`
                        : `${API_URL}/api/tasks/all`;
                } else {
                    endpoint = viewArchived
                        ? `${API_URL}/api/tasks/user/all`
                        : `${API_URL}/api/tasks`;
                }

            const res = await fetch(endpoint, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to fetch tasks');
                return;
            }
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tasks');
        }
    };


    //Create a new Task
    const addTask = async (title) => {
        console.log("adding task", title, user);

        if (!user) return;

        try {
            const res = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title })
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Failed to create task');
            return;
        }

        const newTask = await res.json();
        setTasks(prev => [...prev, newTask])
        showMessage('Task created successfully');

        await fetchTasks();
        } catch (err) {
            console.error(err);
            setError('Failed to create task');
        }
    }

    //Archive Task
    const archiveTask = async (id) => {
    try {
        const res = await fetch(`${API_URL}/api/tasks/${id}/archive` , {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to archive task. res not ok');
        return;
    }

    console.log('Archived task with ID:', id);
    const updatedTask = await res.json();
    setTasks(prevTasks => 
        prevTasks.filter(task => task.id !== id)
    );
    showMessage('Task archived successfully');

    await fetchTasks();
    } catch(err) {
        console.error(err);
        setError('Failed to archive task');
    }
    };

    //Admin archive task
    const adminArchiveTask = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/tasks/${id}/archive`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to archive task');
                return;
            }

            console.log('Successfully admin archived task with ID:', id)
            const updatedTask = await res.json();
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            await fetchTasks();
            showMessage('Task archived successfully');

        } catch (err) {
            console.error(err);
            setError('Failed to archive task');
        }
    };

    //Restore Task
    const restoreTask = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/tasks/${id}/restore`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to restore task');
                return;
            }

            console.log(`Task with ID ${id} restored successfully`);
            setTasks(prevTasks =>
                prevTasks.filter(task => task.id !== id)
            );

            await fetchTasks();
            showMessage('Task restored successfully');

        } catch (err) {
            console.error(err);
            setError('Failed to restore task');
        }
    };


    //Delete Task
    const deleteTask = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/tasks/${id}/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to delete task');
                return;
            }

            console.log(`Task with ID ${id} deleted successfully`);
            setTasks(prevTasks =>
                prevTasks.filter(task => task.id !== id)
            );

            await fetchTasks();
            showMessage('Task deleted successfully');

        } catch (err) {
            console.error(err);
            setError('Failed to delete task');
        }
    };



    //Complete Task
    const toggleComplete = async (id) => {
        try {
        const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ toggle: true }),
    });

    if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to toggle task status')
        return;
    }

    const updatedTask = await res.json();
    console.log(`Toggle task ${id}'s status successfully`);
    setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))

    await fetchTasks();
    showMessage('Task status changed');

        } catch (err) {
            console.error(err);
            setError('Failed to toggle task status');
        }
    }

    //Edit Task
    const editTask = async (id, newTitle) => {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle })
    });
    if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        showMessage('Task updated successfully');
    }
    };

      useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [API_URL, user]);

    return {
        tasks,
        setTasks,
        error,
        setError,
        editTask,
        archiveTask,
        adminArchiveTask,
        viewArchived,
        setViewArchived,
        deleteTask,
        restoreTask,
        toggleComplete,
        addTask,
        fetchTasks
    }
}