const http = require('http');
const db = require('./database');

const server = http.createServer((req, res) => {
    // Only handle POST /api/tasks
    if (req.method === 'POST' && req.url === '/api/tasks') {
        let body = '';

        // 1. Collect data chunks as they arrive (streaming)
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // 2. When request ends, process the complete body
        req.on('end', () => {
            let parsed;
            try {
                parsed = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }

            const { title, completed } = parsed;

            // Validation (Express would skip this unless you add middleware)
            if (!title || typeof title !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Title is required' }));
            }

            // 3. Database insert
            const result = db.prepare(
                'INSERT INTO tasks (title, completed) VALUES (?, ?)'
            ).run(title, completed ? 1 : 0);

            const newTask = db.prepare(
                'SELECT * FROM tasks WHERE id = ?'
            ).get(result.lastInsertRowid);

            // 4. Send response (manual headers + status)
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newTask));
        });

    } else {
        // 404 for everything else
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(3000, () => {
    console.log('Plain Node server on http://localhost:3000');
});