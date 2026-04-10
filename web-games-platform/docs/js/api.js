const API_BASE = 'http://localhost:5000/api';

let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('userData') || 'null');

async function apiCall(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API error');
  }
  return response.json();
}

async function login(username) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username })
  });
  authToken = data.token;
  currentUser = data.user;
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('userData', JSON.stringify(currentUser));
  return currentUser;
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
}

async function submitScore(gameId, score) {
  if (!authToken) return false;
  try {
    await apiCall('/scores', {
      method: 'POST',
      body: JSON.stringify({ gameId, score })
    });
    return true;
  } catch (err) {
    console.error('Failed to submit score', err);
    return false;
  }
}

async function fetchLeaderboard(gameId) {
  const data = await apiCall(`/leaderboard/${gameId}`);
  return data.scores;
}