const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let users = [
  {
    id: 1,
    name: 'Alan Turing',
    email: 'alan.turing@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    email: 'ada.lovelace@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Grace Hopper',
    email: 'grace.hopper@example.com',
    createdAt: new Date().toISOString(),
  },
];

let nextId = 4;

const randomDelay = (min = 10, max = 100) => {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/users - List all users (fast response)
app.get('/api/users', async (req, res) => {
  await randomDelay(10, 50);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedUsers = users.slice(start, end);

  res.json({
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: users.length,
      totalPages: Math.ceil(users.length / limit),
    },
  });
});

// GET /api/users/:id - Get specific user (variable delay)
app.get('/api/users/:id', async (req, res) => {
  await randomDelay(20, 200);

  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// POST /api/users - Create new user (medium response)
app.post('/api/users', async (req, res) => {
  await randomDelay(50, 150);

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: nextId++,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update user (medium response)
app.put('/api/users/:id', async (req, res) => {
  await randomDelay(50, 150);

  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (email && users.some((u) => u.email === email && u.id !== userId)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    updatedAt: new Date().toISOString(),
  };

  res.json(users[userIndex]);
});

// DELETE /api/users/:id - Remove user
app.delete('/api/users/:id', async (req, res) => {
  await randomDelay(30, 100);

  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.status(204).send();
});

// GET /api/slow - Slow endpoint for timeout tests
app.get('/api/slow', async (req, res) => {
  const delay = parseInt(req.query.delay) || 2000;

  await new Promise((resolve) => setTimeout(resolve, delay));

  res.json({ message: 'Slow response', delay });
});

// GET /api/error - Endpoint that returns random error
app.get('/api/error', (req, res) => {
  const random = Math.random();

  if (random < 0.3) {
    res.status(500).json({ error: 'Internal server error' });
  } else if (random < 0.6) {
    res.status(503).json({ error: 'Service unavailable' });
  } else {
    res.json({ message: 'Success!' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`GET    /health`);
  console.log(`GET    /api/users`);
  console.log(`GET    /api/users/:id`);
  console.log(`POST   /api/users`);
  console.log(`PUT    /api/users/:id`);
  console.log(`DELETE /api/users/:id`);
  console.log(`GET    /api/slow`);
  console.log(`GET    /api/error`);
});
