# Online Course Management System

A full-stack web application for managing students, courses, categories and enrolments.

| | |
|---|---|
| **Stack** | React.js · Node.js / Express · MySQL · Swagger |
| **Frontend** | React + Vite · React Router · axios · Bootstrap |
| **Backend** | Node.js · Express · mysql2 · Swagger (OpenAPI) |

---

## Architecture

```
┌─────────────────────┐
│   React.js App      │  Dashboard · list pages · forms · detail pages
│   localhost:5173    │
└──────────┬──────────┘
           │  HTTP / JSON  —  GET · POST · PUT · DELETE
           ▼
┌─────────────────────┐
│ Node.js + Express   │  Routes · Controllers · Models · Swagger
│   localhost:5000    │  Swagger UI at /api-docs
└──────────┬──────────┘
           │  SQL queries
           ▼
┌─────────────────────┐
│       MySQL         │  students · courses · categories · enrolments
└─────────────────────┘
```

The React application never connects to MySQL. Every read is `MySQL → API → React`; every write is
`React → API → MySQL`, and all data displayed in the interface is retrieved from the API.

---

## Database

Four related tables. `enrolments` is a junction table resolving the many-to-many relationship between
students and courses; `categories` is a lookup table for courses.

```
categories ──1:N──> courses ──1:N──> enrolments <──N:1── students
                                         (junction)
```

| Table | Primary key | Foreign keys |
|---|---|---|
| `categories` | `category_id` | — |
| `courses` | `course_id` | `category_id` → `categories` |
| `students` | `student_id` | — |
| `enrolments` | `enrolment_id` | `student_id` → `students`, `course_id` → `courses` |

---

## Running the project

The database must be created first, then the backend started, then the frontend.

**1. Database**

```bash
mysql -u root -p < backend/schema.sql
```

**2. Backend** — http://localhost:5000

```bash
cd backend
npm install
copy .env.example .env   # then fill in your MySQL credentials
npm run dev
```

**3. Frontend** — http://localhost:5173

```bash
cd frontend
npm install
copy .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Swagger documentation is served by the backend at **http://localhost:5000/api-docs**.

---

## API

22 operations across 11 paths.

| Resource | Endpoints |
|---|---|
| Students | `GET /api/students` · `GET /api/students/:id` · `POST` · `PUT /:id` · `DELETE /:id` |
| Courses | `GET /api/courses` (+ `?category_id=`) · `GET /:id` · `POST` · `PUT /:id` · `DELETE /:id` · `GET /:id/students` |
| Categories | `GET /api/categories` · `POST` · `PUT /:id` · `DELETE /:id` |
| Enrolments | `GET /api/enrolments` · `GET /:id` · `POST` · `PUT /:id` · `DELETE /:id` · `GET /api/enrolments/details` |
| Dashboard | `GET /api/dashboard/stats` |

---

## Repository layout

```
.
├── frontend/                    React application
│   ├── src/
│   │   ├── components/          Navbar, Layout, DataTable, ConfirmDialog, Toast, StatCard, FormField
│   │   ├── pages/               Dashboard, Students, Courses, CourseDetails, Enrolments,
│   │   │                        Categories, NotFound
│   │   ├── services/api.js      all HTTP requests
│   │   ├── hooks/  utils/  assets/
│   │   ├── App.jsx              routes
│   │   └── main.jsx             entry point
│   ├── public/
│   ├── .env.example
│   └── package.json
└── backend/                     Express REST API
    ├── config/database.js       mysql2/promise pool
    ├── controllers/             one per resource
    ├── models/                  all SQL queries
    ├── routes/                  one router per resource
    ├── middleware/              errorHandler, notFound, validate
    ├── swagger/swagger.js       OpenAPI definition
    ├── schema.sql               tables, constraints, seed data
    ├── .env.example
    └── app.js
```
