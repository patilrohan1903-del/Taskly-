const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let tasks = [];

// GET /tasks -> Fetch all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks -> Create a task
app.post('/tasks', (req, res) => {
  const { title, description = '' } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and cannot be empty.' });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    status: 'pending',
    created_at: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id -> Update task details
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: 'Title cannot be empty.' });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...(title && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() })
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// PATCH /tasks/:id -> Toggle task status
app.patch('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const currentStatus = tasks[taskIndex].status;
  tasks[taskIndex].status = currentStatus === 'pending' ? 'completed' : 'pending';
  
  res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id -> Delete task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
