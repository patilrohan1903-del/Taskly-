<div align="center">
  <img src="./frontend/public/taskly-icon.svg" width="120" alt="Taskly Logo" />
  <h1>Taskly - Modern Task Manager</h1>
  <p>A beautiful, minimalistic, and highly responsive Task Management application featuring an animated ambient background, real-time filtering, and a robust RESTful API.</p>
</div>

---

## 🚀 Key Features

- **Beautiful Ambient Background:** A custom glassmorphic UI with an animated, floating pastel mesh gradient.
- **Smart Filtering & Search:** Instantly filter tasks by **Active** or **Completed** states, or search by title.
- **Inline Editing:** Double-click any task text or simply hit the `edit` icon to rename your tasks seamlessly.
- **Smooth Animations:** Powered by `framer-motion` for buttery smooth layout transitions, pop-ups, and hover tracking effects.
- **Dynamic Task Interactions:** Active tasks instantly vanish from the "Active" view and slide into "Completed" exactly when checked!
- **Zero-Friction State:** Highly persistent frontend caching mapping cleanly to a lightning-fast NodeJS backend.

## 🛠️ Tech Stack

**Frontend:**
- **React.js (Vite)**
- **Tailwind CSS v3**
- **Framer Motion** (Spring Animations)
- **Lucide React** (Vector Icons)

**Backend:**
- **Node.js & Express.js**
- **CORS** Enabled for cross-origin local requests
- **UUID** for unique task identifier tracking

## 💻 Getting Started (Local Development)

To run **Taskly** locally, you will need to actively run both the Node.js backend server and the Vite frontend server.

### 1. Start the Backend Server
Initiate your terminal and run commands inside the `/backend` folder:
```bash
cd backend
npm install
node server.js
```
*The backend API will boot up securely on `http://localhost:5000`.*

### 2. Start the Frontend Server
Open a **new** terminal window and run commands inside the `/frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
*The React app will boot up on `http://localhost:5173`. Open this link in your latest browser!*

## 🔌 API Endpoints Reference

The Express API follows standard REST architectural patterns returning JSON payloads.

| Method   | Endpoint          | Description                                    |
| :------- | :---------------- | :--------------------------------------------- |
| `GET`    | `/tasks`          | Fetch the list of all tasks.                   |
| `POST`   | `/tasks`          | Create a new task. (Body JSON: `{ title: string }`)  |
| `PUT`    | `/tasks/:id`      | Update a task title based on UUID body.             |
| `PATCH`  | `/tasks/:id`      | Toggle a task's status (Pending ↔ Completed). |
| `DELETE` | `/tasks/:id`      | Delete a task completely from memory.          |

## 🎨 Design & Branding
Taskly ships with beautifully crafted, completely custom vector SVG branding internally structured for scaling.
- Primary **Indigo**: `#4F46E5`
- Success **Emerald**: `#10B981`
- Warning **Amber**: `#F59E0B`
- Typography **Inter**: `sans-serif, system-ui`

---
> **Designed and built with ❤️.** Focus strictly on your tasks without feeling overwhelmed by a cluttered UI.
