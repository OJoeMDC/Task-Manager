import { useState, useEffect } from 'react';

export default function useTasks(user) {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;


    // Fetch user tasks
    const fetchTasks = async () => {
        try {
            const res = await fetch(`${API_URL}/api/tasks`, {
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


    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [API_URL, user]);


    //Create a new Task
    const addTask = (title) => {
        console.log("adding task", title, user);
        
        if (!user) return;

        fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },

        body: JSON.stringify({ title }),
    })
    .then(res => res.json())
    .then(newTask => setTasks(prev => [...prev, newTask]))
    .catch(err => console.error(err));
    };

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
    } catch(err) {
        console.error(err);
        setError('Failed to archive task');
    }
    };

    //Admin archive task
    const adminArchiveTask = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/tasks/${id}/`, {
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
        } catch (err) {
            console.error(err);
            setError('Failed to restore task');
        }
    };

    //Complete Task
    const toggleComplete = (id) => {
    fetch(`${API_URL}/api/tasks/${id}/toggle`, {
        method: 'PUT',
        headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ toggle: true }),
    })
    .then( res => res.json())
    .then(updatedTask => setTasks(tasks.map(t => t.id === id ? updatedTask : t)))
    .catch(err => console.error(err))
    };

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
    }
    };

    return {
        tasks,
        setTasks,
        error,
        setError,
        editTask,
        archiveTask,
        adminArchiveTask,
        restoreTask,
        toggleComplete,
        addTask,
        fetchTasks
    }
}