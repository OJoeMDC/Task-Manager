const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(express.json());
app.use(cors());

// temporary task array to be replaced with databse later
let tasks = [
    { id: 1, title: 'Learn Express', completed: false },
    { id: 2, title: 'Build a task manager', completed: false },
];

//GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

//POST new task
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title,
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask); //Created new task 201
});

//PUT update a task
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error : 'Task not Found' }); // Error handling if unable to match task in const task

    const { title, completed } = req.body;
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    res.json(task);
});

//DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if(index === -1) return res.status(404).json({ error: 'Task not found' });

    tasks.splice(index, 1);
    res.status(204).send(); // 204 Success, but nothing to send back
})


app.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});

