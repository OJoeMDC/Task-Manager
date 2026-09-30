import Database from 'better-sqlite3';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { get } from 'http';


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
    archived INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    `);

 //GET basic tasks for a user
 app.get('/api/tasks', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = db.prepare(`
            SELECT tasks.*, users.username 
            FROM tasks 
            INNER JOIN users 
            ON tasks.user_id = users.id 
            WHERE tasks.user_id = ?
            AND tasks.archived = 0
            AND tasks.completed = 0
            `).all(userId);
        res.json(tasks);
    } catch (err) {
        console.error("GET basic user tasks ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Get ALL tasks for a user
app.get('/api/tasks/user/all', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = db.prepare(`
            SELECT tasks.*, users.username 
            FROM tasks 
            INNER JOIN users 
            ON tasks.user_id = users.id
            WHERE tasks.user_id = ?`
        ).all(userId);
        res.json(tasks);
    } catch (err) {
        console.error("GET all user tasks ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Get specific task for details page
app.get('/api/tasks/task/:id', authenticateToken, (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const userId = req.user.id;

        const task = db.prepare(`
            SELECT tasks.*, users.username 
            FROM tasks 
            INNER JOIN users 
            ON tasks.user_id = users.id
            WHERE tasks.id = ?
            AND tasks.user_id = ?`
        ).get(taskId, userId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        console.error("GET user detailed task ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Admin Get specific task for details page
app.get('/api/admin/tasks/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        const task = db.prepare(`
            SELECT tasks.*, users.username 
            FROM tasks 
            INNER JOIN users 
            ON tasks.user_id = users.id
            WHERE tasks.id = ?`
        ).get(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        console.error("GET admin detailed task ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Get ALL tasks
app.get('/api/tasks/all/all', authenticateToken, requireAdmin, (req, res) => {
    try {
        const tasks = db.prepare('SELECT tasks.*, users.username FROM tasks INNER JOIN users ON tasks.user_id = users.id').all();
        res.json(tasks);
    } catch (err) {
        console.error("GET ALL/ALL tasks ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Get all unarchived tasks
app.get('/api/tasks/all', authenticateToken, requireAdmin, (req, res) => {
    try {
        const tasks = db.prepare(`
            SELECT tasks.*, users.username
            FROM tasks
            INNER JOIN users
            ON tasks.user_id = users.id
            WHERE tasks.archived = 0
            AND tasks.completed = 0
            `).all();
            res.json(tasks);
        } catch (err) {
            console.error("GET ALL unarchived ERROR:", err);
            res.status(500).json({ error: err.message });
        }
})

//Get user archived tasks
app.get('/api/tasks/user/archived', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = db.prepare(`
            SELECT tasks.*, users.username
            FROM tasks
            INNER JOIN users
            ON tasks.user_id = users.id
            WHERE tasks.user_id = ?
            AND tasks.archived = 1
            `).all(userId);
        res.json(tasks);
    } catch (err) {
        console.error("GET user archived ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Get all archived tasks
app.get('/api/tasks/all/archived', authenticateToken, requireAdmin, (req, res) => {
    try {
        const tasks = db.prepare(`
            SELECT tasks.*, users.username
            FROM tasks
            INNER JOIN users
            ON tasks.user_id = users.id
            WHERE tasks.archived = 1
            `).all();
            res.json(tasks);
    } catch (err) {
        console.error("GET ALL archived ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})

//Get completed tasks
app.get('/api/tasks/user/completed', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = db.prepare(`
            SELECT tasks.*, users.username 
            FROM tasks 
            INNER JOIN users 
            ON tasks.user_id = users.id
            WHERE tasks.user_id = ?
            AND tasks.completed = 1
            AND tasks.archived = 0
            `).all(userId);
        res.json(tasks);
        } catch (err) {
            console.error("GET User Completed Tasks ERROR:", err);
            res.status(500).json({ error: err.message });
        }
});

//Get all completed tasks
app.get('/api/tasks/all/completed', authenticateToken, requireAdmin, (req, res) => {
    try {
        const tasks = db.prepare(`
            SELECT tasks.*, users.username 
            FROM tasks 
            INNER JOIN users 
            ON tasks.user_id = users.id
            WHERE tasks.completed = 1
            AND tasks.archived = 0
            `).all();
        res.json(tasks);
    } catch (err) {
        console.error("GET ALL COMPLETED ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//POST new task
app.post('/api/tasks', authenticateToken, (req, res) => {
    try {
        console.log('POST body:', req.body);

        const { title, completed, dueDate } = req.body;
        const userId = req.user.id;

        console.log("title:", title);
        console.log("completed:", completed);
        console.log("userId:", userId);
        console.log("dueDate:", dueDate);

        const result = db.prepare(
            'INSERT INTO tasks (title, completed, user_id, due_date) VALUES (?, ?, ?, ?)'
        ).run(title, completed ? 1 : 0, userId, dueDate || null);

        const newTask = db.prepare(
            'SELECT * FROM tasks WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//PUT update task
app.put('/api/tasks/:id/update', authenticateToken, (req, res) => {
    try {
        const { title, completed, toggle, dueDate } = req.body;
        const taskId = parseInt(req.params.id);
        const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, req.user.id);
        if (!task) return res.status(404).json({ error : 'Task not Found' }); // Error handling if unable to match task in const task

        if (toggle) {
            db.prepare('UPDATE tasks SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ? AND user_id = ?').run(taskId, req.user.id);
        } else {
            db.prepare('UPDATE tasks SET title = ?, completed = ?, due_date = ? WHERE id = ? AND user_id = ?').run(
                title ?? task.title,
                completed !== undefined ? (completed ? 1 : 0)
                : task.completed,
                dueDate ?? task.due_date,
                taskId,
                req.user.id
            );
        }

        const updatedTask = db.prepare('SELECT tasks.*, users.username FROM tasks INNER JOIN users ON tasks.user_id = users.id WHERE tasks.id = ?').get(taskId);
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error("UPDATE TASK ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//PUT update task for another user as admin
app.put('/api/admin/tasks/:id/update', authenticateToken, requireAdmin, (req, res) => {
    try{
        const { title, completed, toggle, dueDate } = req.body;
        const taskId = parseInt(req.params.id);
        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
        if (!task) return res.status(404).json({ error : 'Task not Found' }); // Error handling if unable to match task in const task

        if (toggle) {
            db.prepare('UPDATE tasks SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ?').run(taskId);
        } else {
            db.prepare('UPDATE tasks SET title = ?, completed = ?, due_date = ? WHERE id = ?').run(
                title ?? task.title,
                completed !== undefined ? (completed ? 1 : 0)
                : task.completed,
                dueDate ?? task.due_date,
                taskId
            );
        }

        const updatedTask = db.prepare('SELECT tasks.*, users.username FROM tasks INNER JOIN users ON tasks.user_id = users.id WHERE tasks.id = ?').get(taskId);
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error("ADMIN TASK UPDATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


//ARCHIVE a task
app.put('/api/tasks/:id/archive', authenticateToken, (req, res) => {
    try{
        const taskId = parseInt(req.params.id);
        const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, req.user.id);
        if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

        db.prepare('UPDATE tasks SET archived = 1 WHERE id = ? and user_id = ?').run(taskId, req.user.id);


        const updatedTask = db
            .prepare('SELECT * FROM tasks WHERE id = ? and user_id = ?')
            .get(taskId, req.user.id);


        res.status(200).json(updatedTask);
    } catch (err) {
        console.error("ARCHIVE TASK ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Admin archive task
app.put('/api/admin/tasks/:id/archive', authenticateToken, requireAdmin, (req, res) => {
    try{
        const taskId = parseInt(req.params.id);
        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.prepare('UPDATE tasks SET archived = 1 WHERE id = ?').run(taskId);

        const updatedTask = db
            .prepare('SELECT * FROM tasks WHERE id = ?')
            .get(taskId);

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error("ADMIN ARCHIVE TASK ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Restore task
app.put('/api/tasks/:id/restore', authenticateToken, requireAdmin, (req, res) => {
    try{ 
        const taskId = parseInt(req.params.id);
        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.prepare('UPDATE tasks SET archived = 0 WHERE id = ?').run(taskId);

        const updatedTask = db
            .prepare('SELECT * FROM tasks WHERE id = ?')
            .get(taskId);

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error("RESTORE TASK ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Delete Task
app.delete('/api/tasks/:id/delete', authenticateToken, (req, res) => {
    try{
        const taskId = parseInt(req.params.id);
        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

        if(!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);

        res.status(204).send();
    } catch (err) {
        console.error("DELETE TASK ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//////////////
//USERS CODE//
//////////////


//Get active users
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    try {
        const users = db.prepare('SELECT id, username, username_normalized, role, archived FROM users WHERE archived = 0').all();
        res.json(users);
    } catch (err) {
        console.error("GET active users ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Get ALL users
app.get('/api/users/all', authenticateToken, requireAdmin, (req, res) => {
    try {
        const users = db.prepare('SELECT id, username, username_normalized, role, archived FROM users').all();
        res.json(users);
    } catch (err) {
        console.error("GET ALL usersERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

//Get archived users
app.get('/api/users/archived', authenticateToken, requireAdmin, (req, res) => {
    try {
        const users = db.prepare('SELECT id, username, username_normalized, role, archived FROM users WHERE archived = 1').all();
        res.json(users);
    } catch (err) {
        console.error("GET archived users ERROR:", err);
        res.status(500).json({ error: err.message });
    }
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
        console.error("Create user ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


//Edit users
app.put('/api/users/:id/edit', authenticateToken, requireAdmin, (req, res) => {
    try{
        const userId = parseInt(req.params.id, 10);
        const displayUsername = req.body.username?.trim();
        const role = req.body.role?.trim();

        if (!displayUsername) {
                return res.status(400).json({
                    error: 'Username is required'
                });
            }

            
            const normalized = displayUsername.toLowerCase();

            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

        const existingUser = db.prepare('SELECT * FROM users WHERE username_normalized = ? AND id != ?').get(normalized, userId);

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        db.prepare('UPDATE users SET username = ?, username_normalized = ?, role = ? WHERE id =?').run(displayUsername, normalized, role, userId);

        const updatedUser = db.prepare(`
            SELECT id, username, username_normalized, role, archived
            FROM users
            WHERE id = ?
        `).get(userId);

            res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Edit user ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});




//Archive User
app.put('/api/users/:id/archive', authenticateToken, requireAdmin, (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.prepare('UPDATE users SET archived = 1 WHERE id = ?').run(userId);

        const updatedUser = db
            .prepare('SELECT id, username, username_normalized, role FROM users WHERE id = ?')
            .get(userId);


        res.status(204).send(updatedUser);
    } catch (err) {
        console.error("Archive user ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});




//Restore User
app.put('/api/users/:id/restore', authenticateToken, requireAdmin, (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.prepare('UPDATE users SET archived = 0 WHERE id = ?').run(userId);

        const updatedUser = db
            .prepare('SELECT id, username, username_normalized, role FROM users WHERE id = ?')
            .get(userId);

        res.status(204).send(updatedUser);
    } catch (err) {
        console.error("Restore user ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});



//Delete User
app.delete('/api/users/:id/delete', authenticateToken, requireAdmin, (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.prepare('DELETE FROM users WHERE id = ?').run(userId);

        res.status(204).send();
    } catch (err) {
        console.error("Delete user ERROR:", err);
        res.status(500).json({ error: err.message });
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
        console.error("User login ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


//Token Authentication
function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    } catch (err) {
        console.error("Token Authentication ERROR:", err);
        res.status(500).json({ error: err.message });
    }
}

//Account Seeding
async function seedUsers() {
  const users = [
    {
      username: process.env.ADMIN_USERNAME || 'admin',
      username_normalized: 'admin',
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    },
    {
      username: process.env.TEST_USERNAME || 'TestAccount',
      username_normalized: 'testaccount',
      password: process.env.TEST_PASSWORD || 'password',
      role: 'user',
    },
  ];

  //When called, this finds if a user exists
  const findUser = db.prepare(`
    SELECT id, username_normalized, role
    FROM users
    WHERE username_normalized = ?
  `);

  //When called, this inserts the user dictionary into the DB
  const insertUser = db.prepare(`
    INSERT INTO users (username, username_normalized, password, role)
    VALUES (?, ?, ?, ?)
  `);

  //Add users after checking for provided password or existing user
  for (const user of users) {
    //If no password is present, skip adding to DB
    if (!user.password) {
      console.warn(`Skipping ${user.username}: no password configured`);
      continue;
    }

    //Find A User To see if it exists
    const existingUser = findUser.get(user.username_normalized);
    if (existingUser) {
      console.log(`${user.username} already exists`);
      continue;
    }

    //Encrypt password with bcrypt
    const passwordHash = await bcrypt.hash(user.password, 12);

    //Inserts the user
    insertUser.run(
      user.username,
      user.username_normalized,
      passwordHash,
      user.role
    );

    console.log(`Seeded ${user.role} account: ${user.username}`);
  }
}

//When called, ensures the task requires user to be admin
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}


//Starts the server
async function startServer() {
  try {
    await seedUsers();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}


//Call the server start function
startServer();