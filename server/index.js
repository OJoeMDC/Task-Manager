import Database from 'better-sqlite3';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const app = express();
app.use(express.json());
dotenv.config();


app.get('/', (req, res) => {
    res.send('Task Manager API is running');
});

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
console.log('Using database at:', DB_PATH);
const db = new Database(DB_PATH);

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_PATH:', DB_PATH);

//Create table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    username_normalized TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `);

    //Add user_id column to tasks table if it doesn't exist
    try {
  db.prepare('ALTER TABLE tasks ADD COLUMN user_id INTEGER').run();
  console.log('Added user_id column');
} catch (err) {
  console.log('Migration skipped:', err.message);
}

 //Updpate specific user to admin role
 try {
    db.prepare("UPDATE users SET role = 'admin' WHERE username_normalized = 'administrator'").run();
    console.log('Updated admin user to have role admin');
 } catch {
    console.log('No admin user to update');
 }

 //GET ALL tasks
 app.get('/api/tasks/all', authenticateToken, requireAdmin, (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    res.json(tasks);
});


//GET user tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(userId);
    res.json(tasks);
});

//POST new task
app.post('/api/tasks', authenticateToken, (req, res) => {
    try {
        console.log('POST body:', req.body);

        const { title, completed} = req.body;
        const userId = req.user.id;

        const result = db.prepare(
            'INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)'
        ).run(title, completed ? 1 : 0, userId);

        const newTask = db.prepare(
            'SELECT * FROM tasks WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//PUT update a task
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    const { title, completed, toggle } = req.body;
    const taskId = parseInt(req.params.id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, req.user.id);
    if (!task) return res.status(404).json({ error : 'Task not Found' }); // Error handling if unable to match task in const task

    if (toggle) {
        db.prepare('UPDATE tasks SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ? AND user_id = ?').run(taskId, req.user.id);
    } else {
        db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ? AND user_id = ?').run(
            title ?? task.title,
            completed !== undefined ? (completed ? 1 : 0)
            : task.completed,
            taskId,
            req.user.id
        );
    }

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    res.json(updatedTask);
});



// DELETE a task
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
    res.status(204).send();
});

//////////////
//USERS CODE//
//////////////


//Get users
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    const users = db.prepare('SELECT id, username, username_normalized, role FROM users').all();
    res.json(users);
});


//Create User
app.post('/api/users', async (req, res) => {
    const displayUsername = req.body.username.trim();
    const normalized = displayUsername.trim().toLowerCase();
    const existingUser = db.prepare('SELECT * FROM users WHERE username_normalized = ?').get(normalized);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const user = { username: displayUsername, username_normalized: normalized, password: hashedPassword };
        const result = db.prepare('INSERT INTO users (username, username_normalized, password) VALUES (?, ?, ?)').run(user.username, user.username_normalized, user.password);
        const newUser = db.prepare('SELECT username, username_normalized, role FROM users WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(newUser);
    } catch {
        res.status(500).send();
    }
});


//User Login
app.post('/api/users/login', async (req, res) => {
    const displayUsername = req.body.username.trim();
    const normalized = displayUsername.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE username_normalized = ?').get(normalized);

    if (!user) {
        return res.status(400).json('Invalid username or password');
    }
    try  { 
        const passwordMatches = await bcrypt.compare(req.body.password, user.password);

        if(!passwordMatches) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const accessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.ACCESS_TOKEN_SECRET
        );

        return res.status(200).json({
            message: 'Login Successful',
            user: { id: user.id, username: user.username, role: user.role },
            accessToken
        });

    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});


//Token Authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});