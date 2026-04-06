const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In‑memory data store (persisted to data/db.json)
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

function readDB() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Initialise empty DB
    const defaultDB = { users: [], scores: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultDB, null, 2));
    return defaultDB;
  }
}

function writeDB(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// Helper: generate JWT
function generateToken(userId, username) {
  return jwt.sign({ userId, username }, SECRET_KEY, { expiresIn: '7d' });
}

// Middleware to verify token
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------- API Routes ----------

// Login / Register
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Username required' });
  }
  const db = readDB();
  let user = db.users.find(u => u.username === username);
  if (!user) {
    // Auto‑register new user
    user = {
      id: Date.now().toString(),
      username,
      gamesPlayed: 0,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);
  }
  const token = generateToken(user.id, user.username);
  res.json({ token, user: { id: user.id, username: user.username, gamesPlayed: user.gamesPlayed } });
});

// Get current user info (protected)
app.get('/api/me', authenticate, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, username: user.username, gamesPlayed: user.gamesPlayed } });
});

// Submit a score (protected)
app.post('/api/scores', authenticate, (req, res) => {
  const { gameId, score } = req.body;
  if (!gameId || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid gameId or score' });
  }
  const db = readDB();
  const userId = req.user.userId;
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.gamesPlayed = (user.gamesPlayed || 0) + 1;
  }
  // Save score entry
  db.scores.push({
    id: Date.now().toString(),
    userId,
    username: user.username,
    gameId,
    score,
    date: new Date().toISOString()
  });
  writeDB(db);
  res.json({ success: true });
});

// Get leaderboard for a game
app.get('/api/leaderboard/:gameId', (req, res) => {
  const { gameId } = req.params;
  const db = readDB();
  const scores = db.scores
    .filter(s => s.gameId === gameId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => ({ username: s.username, score: s.score }));
  res.json({ scores });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});