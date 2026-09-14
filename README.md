# The Clubs - Student Club & Event Management Platform

![The Clubs](/frontend/public/AppTitleImage.png)

A full-stack **Club & Event Management System** for universities and colleges to manage student clubs, memberships, and an event approval workflow, with role-based access for admins, club heads, and students.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Roles & Permissions](#-user-roles--permissions)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Quickstart with Docker (Recommended)](#-quickstart-with-docker-recommended)
- [Local Development Setup](#-local-development-setup)
  - [Backend Setup (Node.js)](#1-backend-setup-nodejs)
  - [Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [Default Demo Accounts](#-default-demo-accounts)
- [API Overview](#-api-overview)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## 🌟 Overview

**The Clubs** bridges the communication gap between university administrators, club leads, and students. It centralizes:
- Club discovery and one-click membership joining.
- An event moderation workflow: club heads submit events, admins approve or reject them.
- A calendar view of approved events and role-aware dashboards for each user type.
- Admin tools for managing clubs, users, and their roles.

---

## 🚀 Key Features

### 🏛️ Club Governance & Discovery
- **Club Directory**: Browse all clubs with descriptions and categories.
- **Club Details Page**: View a club's info, head, and member roster.
- **Join Membership**: Students can join a club with one click.
- **Manage Clubs (Admin)**: Create clubs, assign/reassign club heads, edit club details.

### 📅 Event Management & Moderation
- **Moderation Workflow**: Events created by club heads start as `pending`; admins approve or reject them. Events created directly by admins are auto-approved.
- **Role-Scoped Event Lists**: Admins see all events, club heads see their club's events, students see approved events plus events from clubs they've joined, guests see approved events only.
- **Event Calendar**: Calendar view of events.
- **Create / Edit Events**: Club heads and admins can create and edit events (approved events are locked from further edits by club heads).

### 👤 Accounts & Access Control
- **Signup / Login**: Email + password authentication with JWT sessions.
- **Manage Users (Admin)**: List all users and change their role (`admin` / `club_head` / `student`).
- **Personal Dashboards**: Role-aware dashboard, "My Events", and "My Clubs" (memberships) pages.

### 📊 Admin Analytics
- Chart-based overview (via Recharts) on the admin dashboard summarizing clubs, events, and membership activity.

---

## 👥 User Roles & Permissions

| Feature | Admin | Club Head | Student / Member | Guest |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Clubs & Events** | ✅ | ✅ | ✅ | ✅ (approved events only) |
| **Join Clubs** | ✅ | ✅ | ✅ | ❌ |
| **Create / Edit Events** | ✅ | ✅ (Own Club) | ❌ | ❌ |
| **Approve / Reject Events** | ✅ | ❌ | ❌ | ❌ |
| **Manage Users & Assign Roles** | ✅ | ❌ | ❌ | ❌ |
| **Create / Edit / Delete Clubs** | ✅ | ✏️ (Own Club: description/logo only) | ❌ | ❌ |

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS
- **Components**: Radix UI Primitives (Dialog, Alert Dialog, Select, Label, Slot)
- **Icons**: Lucide React
- **Routing**: React Router 7
- **Charts**: Recharts
- **Toasts**: Sonner

### Backend
- **Framework**: Node.js 20+ / Express
- **Database ODM**: Mongoose
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs` password hashing
- **Database**: MongoDB

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server & Reverse Proxy**: Nginx Alpine

---

## 🏗️ System Architecture

```text
               +-------------------------------------------+
               |              Web Browser / Client         |
               +-------------------------------------------+
                                     |
                                     v
                        +-------------------------+
                        |   Nginx (Port 80)       |
                        +-------------------------+
                         /                       \
       Static React Assets                       Proxy API (/api/*)
                       /                           \
                      v                             v
           +---------------------+        +------------------------+
           | React 18 SPA (Vite) |        | Node.js API (Port 5000)|
           +---------------------+        +------------------------+
                                                    |
                                                    v
                                          +--------------------+
                                          | MongoDB Database   |
                                          +--------------------+
```

---

## 🐳 Quickstart with Docker (Recommended)

Run the entire platform (MongoDB database + Node.js backend + React frontend) with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/Pradeep-7142/Club_management.git
cd Club_management

# 2. Build and start all services in the background
docker compose up --build -d

# 3. View live container logs
docker compose logs -f
```

### Access URLs:
- **Web Application**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **MongoDB Database**: `localhost:27018` (mapped from container port `27017`)

### Stop Containers:
```bash
# Stop all services
docker compose down

# Stop and reset database volume
docker compose down -v
```

---

## 🛠️ Local Development Setup

If you prefer to run services individually without Docker:

### Prerequisites
- Node.js (v18+) & npm
- MongoDB (local instance, Docker container, or Atlas connection string)

### 1. Backend Setup (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set MONGODB_URI to point at your MongoDB instance
# (e.g. run `docker run -d -p 27017:27017 mongo:7` for a local instance)

# Run backend (automatically connects and seeds demo data on first start)
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Default Demo Accounts

The database is automatically pre-seeded with sample users and clubs for testing.

> **Password for all demo accounts:** `password`

| Role | Email | Purpose / Permissions |
| :--- | :--- | :--- |
| **Admin** | `admin@university.edu` | Full platform control, approve events, manage users & clubs |
| **Club Head** | `head@university.edu` | Manage Tech Club, create/edit events |
| **Student** | `student@university.edu` | Join clubs, browse events, view dashboard |

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | No |
| `POST` | `/api/auth/signup` | Register new student user | No |
| `GET` | `/api/clubs` | List all clubs | No |
| `GET` | `/api/clubs/my` | List clubs the current user has joined | Yes |
| `GET` | `/api/clubs/:id` | Get a single club | No |
| `GET` | `/api/clubs/:id/members` | List a club's members | Yes |
| `POST` | `/api/clubs` | Create new club | Admin |
| `PUT` | `/api/clubs/:id` | Update a club | Admin / Club Head (own club) |
| `DELETE` | `/api/clubs/:id` | Delete a club | Admin |
| `POST` | `/api/clubs/:id/join` | Join a club | Yes |
| `GET` | `/api/events` | List events (role-scoped) | No (role-aware if authenticated) |
| `GET` | `/api/events/:id` | Get a single event | No |
| `POST` | `/api/events` | Create new event | Admin / Club Head |
| `PUT` | `/api/events/:id` | Update an event | Admin / Club Head (own club) |
| `DELETE` | `/api/events/:id` | Delete an event | Admin / Club Head (own club) |
| `POST` | `/api/events/:id/approve` | Approve a pending event | Admin |
| `POST` | `/api/events/:id/reject` | Reject a pending event | Admin |
| `GET` | `/api/users` | List all registered users | Admin |
| `PUT` | `/api/users/:id/role` | Change a user's role | Admin |

---

## 📁 Project Directory Structure

```text
Club_management/
├── backend/                    # Node.js / Express REST API
│   ├── src/
│   │   ├── routes/             # API endpoints (auth, clubs, events, users)
│   │   ├── models/              # Mongoose schemas (User, Club, ClubMember, Event)
│   │   ├── middleware/          # JWT auth & role-based access middleware
│   │   ├── config.js            # Configuration settings
│   │   ├── db.js                # MongoDB connection
│   │   ├── seed.js              # Automatic database seeding
│   │   ├── serializers.js       # Document-to-JSON formatters
│   │   ├── app.js               # Express app & route registration
│   │   └── server.js            # Server entrypoint
│   ├── Dockerfile               # Backend container definition
│   └── package.json             # Node dependencies
├── frontend/                    # React 18 SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Layout, auth guard, and UI primitives
│   │   │   ├── pages/           # Application views (dashboard, clubs, events, admin)
│   │   │   ├── lib/             # API client, types, and auth context
│   │   │   └── routes.tsx       # Application routing
│   │   └── styles/               # Tailwind CSS & theme
│   ├── Dockerfile                # Frontend multi-stage container
│   ├── nginx.conf                # Nginx reverse proxy & SPA routing config
│   ├── package.json              # Node dependencies
│   └── vite.config.ts            # Vite build configuration
├── docker-compose.yml           # Multi-container orchestration (DB, API, Web)
├── .dockerignore                 # Docker build exclusions
├── .gitignore                    # Git tracked exclusions
└── README.md                     # Project documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Node execution environment | `development` |
| `PORT` | Port the API server listens on | `5000` |
| `SECRET_KEY` | Application session secret key | `dev-secret-change-me` |
| `JWT_SECRET_KEY` | Key for signing JWT tokens | `dev-jwt-secret-change-me` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/the_clubs` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `http://localhost:5173,http://localhost:80` |
| `DEMO_PASSWORD` | Password used for seeded demo accounts | `password` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend URL for API calls | Empty (uses relative `/api` via proxy) |

---

## 📄 License

This project is licensed under the MIT License.
