# Task Manager Full Stack Application

A premium, modern, and responsive full-stack task manager application built with Node.js, Express, React, Vite, and Tailwind CSS. The app features micro-animations using Framer Motion and scalable icons from Lucide React.

## Features
- **Create Tasks**: Add new tasks instantly.
- **View Tasks**: Beautifully animated list of tasks showing pending and completed states.
- **Update Status**: One-click toggle between pending and completed.
- **Delete Tasks**: Remove tasks no longer needed.
- **Real-time UX**: Optimistic UI updates for a snappy, instantaneous feel.

## Prerequisites
- Node.js (v18+)
- npm 

## Running the Application

### 1. Start the Backend API
```bash
cd backend
npm install
node server.js
```
The backend server runs on `http://localhost:5000`.

### 2. Start the Frontend App
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## API Documentation (Endpoints)
The backend provides a pure RESTful JSON API:

- `GET /tasks` - Retrieve a lists of all tasks.
- `POST /tasks` - Create a new task.
  - Body: `{ "title": "String", "description": "String (optional)" }`
- `PUT /tasks/:id` - Update an existing task.
  - Body: `{ "title": "String", "description": "String" }`
- `PATCH /tasks/:id` - Toggle the status of a task between "pending" and "completed".
- `DELETE /tasks/:id` - Delete a task by ID.
