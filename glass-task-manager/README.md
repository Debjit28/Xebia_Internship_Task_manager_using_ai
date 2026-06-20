# Ethereal Glassmorphism Task Manager

A visually stunning, premium Task Manager built with a modern Full-Stack architecture featuring a sleek Ethereal Dark Mode Glassmorphism UI.

## Features
- **Ethereal Glass UI**: Frosted glass effects, dynamic abstract lighting, and modern smooth aesthetics via Tailwind CSS. 
- **Full-Stack CRUD**: Complete Create, Read, Update, and Delete functionality synced instantly.
- **RESTful API**: Clean Node.js / Express backend routing.
- **Local SQLite DB**: Out-of-the-box local database that auto-initializes on startup.

## Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS

**Backend:**
- Node.js
- Express
- SQLite (sqlite3)
- CORS

## Project Structure
- `/frontend`: Vite React Application. Contains all UI logic and styling within `src/App.jsx` and `src/index.css`.
- `/backend`: Node.js Express server. Contains the SQLite schema and API endpoints entirely in `server.js`.

## Setup & Running Locally

### 1. Start the Backend (API & Database)
Navigate to the `backend` folder and start the Node server. It will automatically initialize the `database.sqlite` file if it does not already exist.
\`\`\`bash
cd backend
node server.js
\`\`\`
*The server will run on http://localhost:5000*

### 2. Start the Frontend (UI)
In a new terminal window, navigate to the `frontend` folder and run the Vite dev server.
\`\`\`bash
cd frontend
npm run dev
\`\`\`
*The UI will run on http://localhost:5173*

### Run Both Simultaneously (Bash)
From the root of this project, you can run both in the background/foreground simultaneously:
\`\`\`bash
(cd backend && node server.js) & (cd frontend && npm run dev)
\`\`\`
