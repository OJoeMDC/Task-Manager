const express = require('express');
const app = express();
const db = require('./database');
const cors = require('cors');
const PORT = 3000;

app.use(express.json());
app.use(cors());


//GET all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    res.json(tasks);
});

//POST new task
app.post('/api/tasks', (req, res) => {
    const { title, completed } = req.body;
    const result = db.prepare('INSERT INTO tasks (title, completed) VALUES (?, ?)').run(title, completed ? 1 : 0);
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTask); //Created new task 201
});

//PUT update a task
app.put('/api/tasks/:id', (req, res) => {
    const { title, completed } = req.body;
    const id = parseInt(req.params.id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error : 'Task not Found' }); // Error handling if unable to match task in const task

    db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ?').run(
        title ?? task.title,
        completed !== undefined ? (completed ? 1 : 0) : task.completed,
        id
    );

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
});



// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
