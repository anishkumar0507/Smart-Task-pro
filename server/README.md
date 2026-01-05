# Smart Task Manager - Backend API

A secure and scalable REST API for managing tasks with JWT authentication.

## Features

- User authentication (signup/login) with JWT
- Password hashing with bcrypt
- Task CRUD operations
- User profile management
- Input validation
- Centralized error handling
- MongoDB with Mongoose

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `server` directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and JWT secret.

4. Make sure MongoDB is running (local or Atlas).

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ token, user: { id, name, email } }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user: { id, name, email } }`

### User Profile

- `GET /api/user/profile` - Get current user profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user: { id, name, email } }`

### Tasks

- `GET /api/tasks` - Get all tasks for logged-in user
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ tasks: [...] }`

- `POST /api/tasks` - Create a new task
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title, description, status, dueDate }`
  - Returns: `{ task: {...} }`

- `PUT /api/tasks/:id` - Update a task
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title?, description?, status?, dueDate? }`
  - Returns: `{ task: {...} }`

- `DELETE /api/tasks/:id` - Delete a task
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message: "Task deleted successfully" }`

## Task Status Values

- `Pending`
- `In Progress`
- `Completed`

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time (default: 7d)

