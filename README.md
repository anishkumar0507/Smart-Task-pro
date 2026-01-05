# Smart Task Manager Pro

A full-stack task management application with authentication, task CRUD operations, and AI-powered features.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Status Tracking**: Pending, In Progress, Completed
- **User Profile**: Manage user information
- **AI Integration**: Gemini AI for task optimization and subtask suggestions
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## 📦 Installation

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/smarttask
# JWT_SECRET=your-secret-key

# Start server
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile (Protected)

### Tasks
- `GET /api/tasks` - Get all tasks (Protected)
- `POST /api/tasks` - Create task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

## 📝 Environment Variables

### Frontend (.env)
```
GEMINI_API_KEY=your-gemini-api-key
```

### Backend (server/.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smarttask
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## 🚀 Deployment

### GitHub Pages

1. Update `vite.config.ts` base path to your repository name:
```typescript
base: '/your-repo-name/'
```

2. Build the project:
```bash
npm run build
```

3. Deploy `dist` folder to GitHub Pages

### Backend Deployment

Deploy the `server` folder to platforms like:
- Heroku
- Railway
- Render
- Vercel (Serverless Functions)
- DigitalOcean

Update frontend API base URL in production.

## 📄 License

MIT

## 👤 Author

Smart Task Manager Pro
