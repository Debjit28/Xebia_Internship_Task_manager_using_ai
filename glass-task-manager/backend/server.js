const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = process.env.VERCEL ? path.resolve('/tmp', 'database.sqlite') : path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'Med'
    )`);
  }
});

// GET: Fetch all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Convert SQLite integer (0/1) to boolean for the frontend
    const tasks = rows.map(row => ({
      ...row,
      completed: row.completed === 1
    }));
    res.json(tasks);
  });
});

// POST: Add a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  db.run(
    'INSERT INTO tasks (title, description, priority, completed) VALUES (?, ?, ?, ?)',
    [title, description || '', priority || 'Med', 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        title: title,
        description: description || '',
        priority: priority || 'Med',
        completed: false
      });
    }
  );
});

// PUT: Update task (Status toggle or details update)
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, priority, completed } = req.body;
  const taskId = req.params.id;
  
  // Fetch existing task to allow partial updates
  db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Task not found' });

    const updatedTitle = title !== undefined ? title : row.title;
    const updatedDesc = description !== undefined ? description : row.description;
    const updatedPriority = priority !== undefined ? priority : row.priority;
    const updatedCompleted = completed !== undefined ? (completed ? 1 : 0) : row.completed;

    db.run(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, completed = ? WHERE id = ?',
      [updatedTitle, updatedDesc, updatedPriority, updatedCompleted, taskId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id: parseInt(taskId, 10),
          title: updatedTitle,
          description: updatedDesc,
          priority: updatedPriority,
          completed: updatedCompleted === 1
        });
      }
    );
  });
});

// DELETE: Remove a task
app.delete('/api/tasks/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Task deleted successfully', changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
