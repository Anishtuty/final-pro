# 🎮 Web Games Platform

A full-stack web games platform featuring four classic games with score tracking and leaderboards.

## Games

| Game | Description |
|------|-------------|
| **Tic-Tac-Toe** | Play against an AI opponent |
| **Snake** | Classic snake arcade game |
| **Memory Match** | Find matching emoji pairs |
| **Quiz Challenge** | Test your knowledge with trivia |

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express
- **Database:** LowDB (JSON file-based)

## Getting Started

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Start the server
```bash
npm start
```

### 3. Open in browser
Navigate to [http://localhost:3001](http://localhost:3001)

## Project Structure

```
web-games-platform/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json
│   └── data/
│       └── db.json        # Auto-created on first run
├── frontend/
│   ├── index.html         # Landing page
│   ├── css/style.css      # Design system
│   ├── js/
│   │   ├── main.js        # Leaderboard & score modal
│   │   ├── api.js         # API helper
│   │   └── games/
│   │       ├── tictactoe.js
│   │       ├── snake.js
│   │       ├── memory.js
│   │       └── quiz.js
│   └── games/
│       ├── tic-tac-toe.html
│       ├── snake.html
│       ├── memory.html
│       └── quiz.html
└── README.md
```

## Features

- 🎨 Modern dark UI with glassmorphism and animated backgrounds
- 📊 Global leaderboard with game filtering
- 💾 Persistent score storage with LowDB
- 📱 Responsive design with mobile game controls
- 🤖 AI opponent for Tic-Tac-Toe
