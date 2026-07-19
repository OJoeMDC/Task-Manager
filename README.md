# Task Manager

A full-stack task management application with React/Vite frontend and Node/Express/SQLite backend.

## Live Demo
[Task-Manager Live Demo](https://bubbly-reprieve-production-4d0b.up.railway.app)

### Seeded Accounts

To quickly explore the application, you can log in using the demo account below.

#### Test Account

Username: TestAccount   
Password: password

#### Admin

Username: admin
password: replace-this-with-a-strong-password

## Features
User registration      
Secure password hashing with bcrypt   
Personal task lists (users can only view and manage their own tasks)   
Create, edit, complete, and delete tasks   
Persistent SQLite database   
Responsive React frontend   
RESTful Express API   

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, CSS |
| **Backend** | Node.js, Express, better-sqlite3 |
| **Database** | SQLite (persisted via Railway Volume) |
| **Deployment** | Railway (backend + static frontend) |
| **Version Control** | GitHub |

## Project Structure


```text
Task-Manager/
├── client/                     # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # React assets
│   │   ├── pages/              # Page-level components
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── package.json
│   └── railpack.json           # Railway static site config
│
├── server/                     # Express backend
│   ├── index.js                # Server entry point
│   ├── package.json
│   └── tasks.db                # Local SQLite database
│
└── README.md
```


## Features

- Create, read, update, delete tasks
- Mark tasks complete/incomplete
- Edit task titles inline
- Persistent data across deployments (Railway Volume)
- CORS configured for frontend-backend communication
- Responsive design

## Local Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Backend
cd server
npm install
npm start          # Runs on http://localhost:3000


### Frontend
cd client
npm install
npm run dev          # Runs on http://localhost:5173


### Environment Variables

**Backend (`server/.env`)**

PORT=3000
NODE_ENV=development
DB_PATH=./tasks.db


**Frontend (`client/.env.development`)**

VITE_API_URL=http://localhost:3000


## Deployment (Railway)

### Backend Service
- **Root Directory**: `server`
- **Start Command**: `npm start`
- **Healthcheck**: `/api/tasks`
- **Volume**: `task-manager-data` mounted at `/data`
- **Environment Variables**:
  
  NODE_ENV=production
  DB_PATH=/data/tasks.db
  

### Frontend Service (Static Site)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  
  VITE_API_URL=https://your-backend-url.up.railway.app
  

## Database Schema

sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  username_normalized TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);
    
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (both client/server) |
| `npm run build` | Build frontend for production |
| `npm start` | Start production server |

## To Do:

Admin account CRUD controls
Jest testing
Move deleted projects to archive instead

Group Management / Owners
Task assignment to accounts
Password reset
