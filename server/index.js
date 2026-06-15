import Database from 'better-sqlite3';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
// import routes from './routes/index.js';
// import { authMiddleware } from './middleware/auth.js';


const app = express();
app.use(express.json());
// app.use( '/api', routes);


// app.get('/api/me', authMiddleware, (req, res) => {
//     res.json({ user: req.user });
// });

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://bubbly-reprieve-production-4d0b.up.railway.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

console.log('process.env.PORT =', process.env.PORT);
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH ?? (process.env.NODE_ENV == 'production' ? '/data/tasks.db' : path.join(__dirname, 'tasks.db'));
const db = new Database(DB_PATH);

//Create table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
    )
    `);



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
    const { title, completed, toggle } = req.body;
    const id = parseInt(req.params.id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error : 'Task not Found' }); // Error handling if unable to match task in const task

    if (toggle) {
        db.prepare('UPDATE tasks SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
    } else {
        db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ?').run(
            title ?? task.title,
            completed !== undefined ? (completed ? 1 : 0)
            : task.completed,
            id
        );
    }

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

//////////////
//USERS CODE//
//////////////

//User Array
const users = [];


//Get users
app.get('/users', (req, res) => {
    res.json(users);
});


//Create User
app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
    res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try  { 
        if( await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});