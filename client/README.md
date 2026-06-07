### `client/README.md`

```markdown
# Task Manager — Frontend

React 19 + Vite single-page application.

## Structure

```
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
```

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

```js
const API_URL = import.meta.env.VITE_API_URL
fetch(`${API_URL}/api/tasks`, ...)
```

## Deployment (Railway Static Site)

- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment**: `VITE_API_URL` = backend production URL

## Adding Pages

1. Create component in `src/components/`
2. Add route logic in `App.jsx` (or install `react-router-dom`)
3. Update `index.html` title if needed
```
