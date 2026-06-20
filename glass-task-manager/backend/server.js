const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// IN-MEMORY DATABASE
// Using an array so Vercel Serverless doesn't crash on filesystem write attempts.
let tasks = [];
let nextId = 1;

// GET: Fetch all tasks
app.get('/api/tasks', (req, res) => {
  res.json([...tasks].reverse());
});

// POST: Add a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    priority: priority || 'Med',
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT: Update task (Status toggle or details update)
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  const { title, description, priority, completed } = req.body;
  const updatedTask = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    priority: priority !== undefined ? priority : tasks[taskIndex].priority,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed
  };
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// DELETE: Remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  tasks = tasks.filter(t => t.id !== taskId);
  res.json({ message: 'Task deleted successfully', changes: 1 });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export Express app for Vercel Serverless
module.exports = app;
