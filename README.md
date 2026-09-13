# The Clubs - Comprehensive Club & Event Management Platform

![The Clubs](/frontend/public/AppTitleImage.png)

A modern, full-stack **Club & Event Management System** designed for universities, colleges, and organizations to streamline student club governance, event lifecycle workflows, memberships, attendance tracking, and administrative analytics.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Roles & Permissions](#-user-roles--permissions)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Quickstart with Docker (Recommended)](#-quickstart-with-docker-recommended)
- [Local Development Setup](#-local-development-setup)
  - [Backend Setup (Flask)](#1-backend-setup-flask)
  - [Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [Default Demo Accounts](#-default-demo-accounts)
- [API Overview](#-api-overview)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## 🌟 Overview

**The Clubs** bridges the communication gap between university administrators, club leads, and students. It replaces fragmented spreadsheets, manual email chains, and disconnected chats with a centralized platform for:
- Creating and approving club events with a moderation workflow.
- Engaging students through calendar scheduling, club discovery, and photo galleries.
- Rewarding top clubs with a dynamic points and leaderboard system.
- Generating downloadable PDF executive performance reports.

---

## 🚀 Key Features

### 🏛️ Club Governance & Discovery
- **Club Directory**: Browse clubs categorized by domain (Technology, Arts, Sports, Entrepreneurship, etc.).
- **Join & Membership Management**: Students can join clubs with one click; club heads can monitor active member rosters.
- **Gamified Leaderboard**: Automatic ranking of clubs based on engagement points and activities.

### 📅 Event Management & Moderation
- **Moderation Workflow**: Events transition from `Pending` ➔ `Approved` / `Rejected` by authorized administrators.
- **Centralized Event Calendar**: Color-coded view of upcoming campus events.
- **Attendance & Check-in Tracking**: Monitor participation metrics for each event.
- **Event Photo Gallery**: Upload and showcase event photos with role-based access.

### 🔔 Smart Notification Center
- Real-time updates on event approvals, rejections, club announcements, and reminders.
- Granular mark-as-read and batch deletion controls.

### 📊 Analytics & Reporting
- Visual analytics dashboard powered by interactive Recharts.
- **One-Click PDF Export**: Download annual club performance reports directly using `jsPDF` and `html2canvas`.

---

## 👥 User Roles & Permissions

| Feature | Admin | Club Head | Student / Member | Guest |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Clubs & Events** | ✅ | ✅ | ✅ | ✅ |
| **Join Clubs** | ✅ | ✅ | ✅ | ❌ |
| **Create / Edit Events** | ✅ | ✅ (Own Club) | ❌ | ❌ |
| **Approve / Reject Events** | ✅ | ❌ | ❌ | ❌ |
| **Upload Gallery Photos** | ✅ | ✅ (Own Club) | ❌ | ❌ |
| **Manage Users & Assign Roles** | ✅ | ❌ | ❌ | ❌ |
| **Create & Delete Clubs** | ✅ | ❌ | ❌ | ❌ |
| **Generate Annual Reports** | ✅ | ✅ | ❌ | ❌ |

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS & Modern Custom UI Components
- **Components**: Radix UI Primitives & Material UI (MUI)
- **Icons & Motion**: Lucide React & Framer Motion
- **Routing**: React Router 7
- **Charts & Reporting**: Recharts, jsPDF, html2canvas

### Backend
- **Framework**: Python 3.11+ / Flask
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy & Flask-Migrate
- **Authentication**: JWT (Flask-JWT-Extended) & Bcrypt Password Hashing
- **WSGI Server**: Gunicorn (Production)
- **Database**: PostgreSQL (Production) / SQLite (Local Dev Supported)

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
           +---------------------+        +--------------------+
           | React 18 SPA (Vite) |        | Flask API (Port 5000)|
           +---------------------+        +--------------------+
                                                    |
                                                    v
                                          +--------------------+
                                          | PostgreSQL Database|
                                          +--------------------+
```

---

## 🐳 Quickstart with Docker (Recommended)

Run the entire platform (PostgreSQL database + Flask backend + React frontend) with a single command:

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
- **PostgreSQL Database**: `localhost:5432`

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
- Python (v3.10+)
- PostgreSQL (or local SQLite)

### 1. Backend Setup (Flask)

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run backend (Automatically creates tables and seeds demo data on first start)
python run.py
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
| **Club Head** | `head@university.edu` | Manage Tech Club, create events, upload gallery photos |
| **Student** | `student@university.edu` | Join clubs, explore events, check notifications |

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | No |
| `POST` | `/api/auth/signup` | Register new student/user | No |
| `GET` | `/api/clubs` | List all clubs | No |
| `POST` | `/api/clubs` | Create new club | Admin |
| `POST` | `/api/clubs/<id>/join` | Join a club | Yes |
| `GET` | `/api/events` | List all events | No |
| `POST` | `/api/events` | Create new event request | Admin / Club Head |
| `POST` | `/api/events/<id>/approve`| Approve pending event | Admin |
| `POST` | `/api/events/<id>/reject` | Reject pending event | Admin |
| `GET` | `/api/gallery` | Get role-filtered gallery photos | Yes |
| `POST` | `/api/gallery/upload` | Upload event photo | Admin / Club Head |
| `GET` | `/api/notifications` | Get user notifications | Yes |
| `GET` | `/api/reports/yearly` | Get yearly analytics report | Admin / Club Head |
| `GET` | `/api/users` | List all registered users | Admin |

---

## 📁 Project Directory Structure

```text
The_Clubs/
├── backend/                    # Flask REST API
│   ├── app/
│   │   ├── routes/             # API Endpoints (auth, clubs, events, etc.)
│   │   ├── config.py           # Configuration settings
│   │   ├── models.py           # SQLAlchemy database models
│   │   ├── seed.py             # Automatic database seeding
│   │   └── serializers.py      # Object-to-dict data formatters
│   ├── Dockerfile              # Backend container definition
│   ├── requirements.txt        # Python package dependencies
│   ├── run.py                  # Local dev server entrypoint
│   └── wsgi.py                 # Production Gunicorn entrypoint
├── frontend/                   # React 18 SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # UI & Layout components (Navbars, Dialogs)
│   │   │   ├── pages/          # Application views (Dashboard, Events, Admin)
│   │   │   ├── lib/            # API client, types, and authentication context
│   │   │   └── routes.tsx      # Application routing
│   │   └── styles/             # Tailwind CSS & custom design system
│   ├── Dockerfile              # Frontend multi-stage container
│   ├── nginx.conf              # Nginx reverse proxy & SPA routing config
│   ├── package.json            # Node dependencies
│   └── vite.config.ts          # Vite build configuration
├── docker-compose.yml          # Multi-container orchestration (DB, API, Web)
├── .dockerignore               # Docker build exclusions
├── .gitignore                  # Git tracked exclusions
└── README.md                   # Project documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `FLASK_ENV` | Flask execution environment | `development` |
| `SECRET_KEY` | Flask session secret key | `dev-secret-change-me` |
| `JWT_SECRET_KEY` | Key for signing JWT tokens | `dev-jwt-secret-change-me` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/the_clubs` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `http://localhost:5173,http://localhost:80` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend URL for API calls | Empty (uses relative `/api` via proxy) |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
