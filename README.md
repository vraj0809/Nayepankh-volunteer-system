# NayePankh Foundation — Volunteer Registration System

A full-stack volunteer registration and management system for **NayePankh Foundation**, built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Forms | React Hook Form + Zod |

## 📁 Project Structure

```
nayepankh-volunteer-system/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── pages/   # Public, admin, volunteer pages
│   │   ├── components/
│   │   ├── services/ # API calls
│   │   ├── hooks/
│   │   └── utils/
│   └── .env         # VITE_API_URL
│
└── server/          # Node.js backend
    ├── config/      # DB connection
    ├── controllers/
    ├── middleware/
    ├── models/      # Mongoose schemas
    ├── routes/
    ├── utils/
    └── .env         # MongoDB URI, JWT secret
```

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/vraj0809/Nayepankh-volunteer-system.git
cd Nayepankh-volunteer-system
```

### 2. Setup the Backend
```bash
cd server
npm install

# Create your .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Setup the Frontend
```bash
cd client
npm install

# Create .env if needed (default works for local dev)
# VITE_API_URL=http://localhost:5000/api
```

### 4. Run Both Servers

**Terminal 1 — Backend:**
```bash
cd server
npm start
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

## 🔐 Environment Variables

### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nayepankh_volunteers
JWT_SECRET=your_random_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### `client/.env` (optional for local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 👤 Default Admin Account

After first server start, an admin is seeded automatically:
- **Email:** `admin@nayepankh.org`
- **Password:** `Admin@123`

> ⚠️ Change these credentials before deploying to production.

## 📋 Features

- ✅ **Volunteer Registration** — Multi-step form with validation
- ✅ **JWT Authentication** — Secure login for volunteers and admins
- ✅ **Volunteer Dashboard** — View application status and profile
- ✅ **Admin Dashboard** — Charts, statistics, volunteer management
- ✅ **Status Management** — Approve / Reject volunteer applications
- ✅ **Reports & Export** — CSV export of volunteer data
- ✅ **Search & Filter** — Filter by status, city, skills, year
- ✅ **Dark Mode UI** — Glassmorphism design with emerald/violet theme

## 🌐 Deployment

### Backend (Render / Railway)
1. Set environment variables on the platform
2. Set `NODE_ENV=production`
3. Set `CLIENT_URL` to your frontend URL
4. Deploy the `server/` folder

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build command: `npm run build`
3. Publish directory: `dist/`

## 📄 License

MIT — NayePankh Foundation
