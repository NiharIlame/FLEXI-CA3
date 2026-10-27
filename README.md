# Student Productivity Dashboard

## Project Overview
This project is a full-stack academic web application designed for the CA-3 examination in Full Stack Web Development. The application helps students manage academic tasks, notes, deadlines, and personal productivity from a single dashboard.

## Problem Statement
Students often struggle to organize assignments, deadlines, and notes in one place. A centralized productivity dashboard allows them to track pending work, monitor deadlines, and maintain academic notes effectively.

## Objectives
- Build a responsive React frontend.
- Create a secure Node.js and Express backend.
- Connect the backend to MongoDB using Mongoose.
- Implement registration, login, and authenticated routes.
- Allow users to create, read, update, and delete tasks and notes.
- Display real statistics from the database on the dashboard.
- Comply with the required academic project structure and CRUD workflow.

## Features
- User registration and login
- JWT-based protected routes
- Dashboard with summary stats
- Full CRUD operations for tasks
- Full CRUD operations for notes
- Search, filter, and sort support
- Responsive layout for desktop and mobile
- MongoDB persistence
- Error handling and validation

## Technology Stack
- Frontend: React.js, Vite, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: bcryptjs, JWT
- Environment management: dotenv
- Cross-origin support: cors

## Folder Structure
```text
YOUR_PRN/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── index.html
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
└── .env.example (optional root-level documentation)
```

## Architecture Overview
The application is split into a frontend client and backend server. The frontend performs HTTP requests to the backend API, which handles validation, authentication, and database operations. MongoDB stores users, tasks, and notes, and each record is associated with the authenticated user.

## Database Collections and Schemas
### User
- name
- email
- password
- createdAt

### Task
- title
- description
- subject
- priority
- status
- dueDate
- user
- createdAt
- updatedAt

### Note
- title
- content
- subject
- user
- createdAt
- updatedAt

## API Endpoints
### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Tasks
- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- PATCH /api/tasks/:id/status
- DELETE /api/tasks/:id

### Notes
- POST /api/notes
- GET /api/notes
- GET /api/notes/:id
- PUT /api/notes/:id
- DELETE /api/notes/:id

### Dashboard
- GET /api/tasks/dashboard-stats

## Installation Instructions
### 1. Install Node.js
Download and install Node.js LTS from: https://nodejs.org/

### 2. Install or configure MongoDB
Use a local MongoDB Community Server or MongoDB Atlas. For a local setup, make sure MongoDB is installed and the service is running.

### 3. Open MongoDB Compass
Connect to MongoDB using the local URI:
```text
mongodb://127.0.0.1:27017/site_data
```

## Environment Configuration
### Server
Create a .env file in the server folder using the example:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/site_data
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

### Client
Create a .env file in the client folder using the example:
```env
VITE_API_URL=http://localhost:5000/api
```

## Run the Application
### Terminal 1: Backend
```bash
cd server
npm install
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm install
npm run dev
```

Open the frontend in the browser at:
```text
http://localhost:5173
```

## Testing Instructions
- Register a new account
- Log in with that account
- Create a task and verify it saves to MongoDB
- Edit and delete tasks
- Create notes and verify CRUD flows
- Log out and verify protected routes redirect to login
- Confirm data remains isolated per user

## GitHub Repository Information
Repository naming should follow:
```text
YOUR_PRN-CA-03
```
Example:
```text
25070521163-CA-03
```
Do not push a repository without explicit approval.

## GitHub Upload Commands
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/YOUR_PRN-CA-03.git
git push -u origin main
```

## Notes
- Do not commit .env files or secrets.
- Keep the project root named using the PRN only.
- The backend and frontend are kept in separate folders as required.
