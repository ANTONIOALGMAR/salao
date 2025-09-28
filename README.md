# Salão de Beleza - Appointment Scheduling App

This is a full-stack application for a beauty salon that allows clients to schedule appointments with employees.

## Features

- User registration and authentication (client, employee, admin roles).
- Service management (create, update, delete services).
- Appointment scheduling and management.
- Admin dashboard to manage users, services, and appointments.

## Tech Stack

- **Frontend:** Vanilla JavaScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Testing:** Vitest (frontend), Jest (backend)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/salao-app.git
   cd salao-app
   ```

2. Install backend dependencies:
   ```bash
   npm install --prefix backend
   ```

3. Install frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```

### Environment Variables

**Backend:**

Create a `.env` file in the `backend` directory by copying the `.env.example` file:

```bash
cp backend/.env.example backend/.env
```

Update the `backend/.env` file with your environment variables:

- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secret key for JWT.

**Frontend:**

Create a `.env` file in the `frontend` directory by copying the `.env.example` file:

```bash
cp frontend/.env.example frontend/.env
```

Update the `frontend/.env` file with your environment variables:

- `VITE_API_URL`: The URL of the backend API (e.g., `http://localhost:5000/api`).

### Running the Application

Use the `dev` script in the root `package.json` to run both the frontend and backend concurrently:

```bash
npm run dev
```

### Running Tests

**Backend:**

```bash
npm test --prefix backend
```

**Frontend:**

```bash
npm test --prefix frontend
```
