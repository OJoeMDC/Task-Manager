### `server/README.md`

```markdown
# Task Manager — Backend

Express + better-sqlite3 REST ▉
Osceola MDC
can you make one for client and server too?
client/README.md

# Task Manager — Frontend

React 19 + Vite single-page application.

## Structure


client/
├── public/                 # Static assets (copied to dist/)
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── TaskInput.jsx   # Add new task form
│   │   ├── TaskList.jsx    # Renders task list
│   │   ├── Task.jsx        # Individual task (edit/toggle/delete)
│   │   └── Navbar.jsx      # Top navigation
│   ├── App.jsx             # State + API calls
│   ├── App.css             # Styles
│   └── main.jsx            # Entry point
├── index.html              # Template (edit title/favicon here)
├── package.json
├── railpack.json           # Railway static site config
├── .env.development        # VITE_API_URL=http://localhost:3000
└── .env.production         # VITE_API_URL=https://your-backend.up.railway.app

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Build to `dist/` for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

| File | Variable | Value |
|------|----------|-------|
| `.env.development` | `VITE_API_URL` | `http://localhost:3000` |
| `.env.production` | `VITE_API_URL` | `https://your-backend.up.railway.app` |

> Only `VITE_*` vars are exposed to the browser.

## API Integration

All API calls in `App.jsx` use:

js
const API_URL = import.meta.env.VITE_API_URL
fetch(${API_URL}/api/tasks, ...)

## Deployment (Railway Static Site)

- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment**: `VITE_API_URL` = backend production URL

## Adding Pages

1. Create component in `src/components/`
2. Add route logic in `App.jsx` (or install `react-router-dom`)
3. Update `index.html` title if needed

---

server/README.md

# Task Manager — Backend

Express + better-sqlite3 REST API.

## Structure

server/
├── index.js              # Express app, routes, DB connection
├── package.json
└── tasks.db              # SQLite file (local only; Railway uses volume)


## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with auto-reload (requires `nodemon`) |

## Environment Variables

| Variable | Development | Production (Railway) |
|----------|-------------|---------------------|
| `PORT` | `3000` | Set by Railway (`process.env.PORT`) |
| `NODE_ENV` | `development` | `production` |
| `DB_PATH` | `./tasks.db` | `/data/tasks.db` (volume mount) |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://your-frontend.up.railway.app` |

## Database

- **Library**: `better-sqlite3` (synchronous, fast)
- **File**: `tasks.db` (auto-created if missing)
- **Schema** (auto-run on startup):

sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0
);


## API Endpoints

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/api/tasks` | — | `Task[]` |
| POST | `/api/tasks` | `{ title, completed? }` | `Task` (201) |
| PUT | `/api/tasks/:id` | `{ title?, completed?, toggle? }` | `Task` |
| DELETE | `/api/tasks/:id` | — | `204` |
| GET | `/api/health` | — | `{ ok: true }` |

## CORS

Configured in `index.js`:

js
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.up.railway.app'
]
app.use(cors({ origin: allowedOrigins, credentials: true }))


## Deployment (Railway)

- **Root Directory**: `server`
- **Start Command**: `npm start`
- **Healthcheck Path**: `/api/tasks`
- **Volume**: `task-manager-data` → mount path `/data`
- **Variables**: `NODE_ENV=production`, `DB_PATH=/data/tasks.db`

## Local Development

cd server
npm install
npm start          # Runs on http://localhost:3000


Frontend `.env.development` must have `VITE_API_URL=http://localhost:3000`.


---

To add:

# Client
cat > client/README.md << 'EOF'
[paste client README above]
EOF

# Server
cat > server/README.md << 'EOF'
[paste server README above]
EOF

git add client/README.md server/README.md
git commit -m "Add client and server READMEs"
git push
