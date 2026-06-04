const Database = require('better-sqlite3');
const db = new Database('tasks.db');

//Create the tasks table if it doesnt exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
    )
`);

module.exports = db;