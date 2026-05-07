# RoomRadar 🎯

RoomRadar is a MERN stack web application built for hostel environments that enables near real-time room presence tracking. It allows students to check into rooms using manual selection or QR Code scanning, while administrators can manage the entire hostel structure.

## Features ✨

### Admin Features:
- **Manage Rooms:** Create, edit, delete, and view hostel rooms.
- **Manage Students:** Add student accounts and manage their presence.
- **QR Generation:** Automatically generates check-in QR codes for every created room.
- **Dashboard Overview:** View all students and their current room locations in real time.

### Student Features:
- **Authentication:** Secure self-registration and login.
- **Presence Tracking:** Check-in dynamically via dropdown or scanning a Room QR Code.
- **Real-Time Directory:** View the live location of peers with 10-second background polling.

### Enterprise Level Architecture 🚀:
- **HttpOnly Cookies:** Defends against XSS by securely storing JWT tokens in cookies rather than `localStorage`.
- **Global Error Handling:** Centralized backend middleware for clean, standard error stack formatting.
- **Security:** Fully protected REST API routes with robust Role-Based Access Control (RBAC).
- **Modern UI:** Glassmorphism UI aesthetic with dynamic mobile responsiveness.

---

## Getting Started ⚙️

### Prerequisites
Make sure you have installed on your local machine:
- **Node.js** (v16+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
If you haven't already:
```bash
git clone <repository_url>
cd RoomRadar
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root and configure it:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/roomradar
   JWT_SECRET=supersecretkey123
   NODE_ENV=development
   ```
   *(Ensure your MongoDB server is actively running!)*
4. Initialize the database and start the server:
   ```bash
   npm run dev
   ```
   *(This starts the backend on port 5000 using nodemon)*

5. **First-Time Admin Setup:**
   To create the master Admin account, make a `POST` request to `http://localhost:5000/api/auth/init`.
   This will generate an admin account:
   - **Email:** admin@roomradar.com
   - **Password:** admin123

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## Tech Stack 🛠️
- **Frontend:** React (Vite), CSS3 (Variables, Flexbox, Glassmorphism), `react-router-dom`, `axios`, `react-hot-toast`, `lucide-react`, `qrcode.react`, `html5-qrcode`.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Security:** `bcryptjs` (Password Hashing), `jsonwebtoken` (JWT), `cookie-parser` (HttpOnly Sessions), `cors`.

## Troubleshooting 🔍
- **Cannot connect to MongoDB?** Ensure MongoDB is running as a background service on your local machine.
- **CORS Issues?** Ensure that the `cors` middleware in `backend/index.js` allows your frontend's exact origin port (usually `http://localhost:5173`).

---
*Built as a Proof of Concept (PoC) for Hostel Presence Tracking.*
