# Team Task Manager

A full-stack task management application built with React, Node.js, and MySQL. Features role-based access control, project management, task tracking, and analytics with a modern dark theme UI.

## Features

### For Admins
- Create and manage projects
- Create and assign tasks to team members
- Edit or delete projects and tasks
- Add or remove team members from projects
- View comprehensive dashboard with statistics
- Monitor overdue tasks

### For Members
- View assigned projects and tasks
- Update task status (To Do → In Progress → Done)
- View personal dashboard with task summary
- See task priority and due dates
- View overdue tasks

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18+ with Vite |
| Styling | Tailwind CSS |
| UI Components | Radix UI, Lucide Icons |
| State Management | Context API, Zustand |
| Form Validation | React Hook Form + Zod |
| API Client | Axios with interceptors |
| Backend | Node.js + Express |
| Database | MongoDB (Atlas free tier) |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| Deployment | Railway |

## Project Structure

```
team-task-manager/
├── backend/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── routes/          # API endpoints
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/      # Auth & role guards
│   │   └── auth.js
│   ├── server.js        # Express app entry
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Route pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   └── Tasks.jsx
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── Skeleton.jsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/           # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── api/             # API calls
│   │   │   ├── axiosInstance.js
│   │   │   └── endpoints.js
│   │   ├── utils/           # Helper functions
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier)
- Git

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd team-task-manager/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   JWT_SECRET=your_super_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will open at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `POST /api/projects` - Create project (Admin only)
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members` - Remove member from project

### Tasks
- `POST /api/tasks` - Create task (Admin only)
- `GET /api/tasks` - Get tasks (filtered by assignee for members)
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task (members can only change status)
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `GET /api/tasks/overdue` - Get overdue tasks

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  createdAt: Date
}
```

### Project
```javascript
{
  title: String,
  description: String,
  createdBy: User (ref),
  members: [User] (ref array),
  createdAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  status: 'todo' | 'in-progress' | 'done',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  assignedTo: User (ref),
  project: Project (ref),
  createdBy: User (ref),
  createdAt: Date
}
```

## Demo Credentials

After first run, use these credentials to test:
- **Admin:** admin@example.com / password123
- **Member:** member@example.com / password123

(You'll need to register these accounts first)

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Deployment on Railway

### Backend Deployment
1. Push backend code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project → Import from GitHub
4. Add environment variables in Railway dashboard
5. Deploy

### Frontend Deployment
1. Push frontend code to GitHub
2. Create new project on Railway
3. Set build command: `npm run build`
4. Set start command: `npm run preview`
5. Set `VITE_API_URL` to your deployed backend URL
6. Deploy

## Features Breakdown

### Authentication
- JWT-based authentication
- Password hashing with bcryptjs
- Token stored in localStorage
- Automatic token refresh on login

### Role-Based Access
- **Admin:** Full CRUD on projects and tasks
- **Member:** Read-only access except task status updates

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Flexbox and Grid layouts
- Dark theme optimized

### Modern UI/UX
- Smooth transitions and animations
- Toast notifications
- Loading spinners
- Skeleton loaders
- Modal dialogs
- Status badges
- Priority indicators

### Form Validation
- Client-side validation
- Real-time error messages
- Required field indicators
- Email format validation

## Troubleshooting

### MongoDB Connection Issues
- Ensure IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify credentials are correct

### CORS Errors
- Ensure `VITE_API_URL` in frontend matches backend URL
- Check CORS middleware in backend

### Frontend Not Loading Data
- Open browser DevTools → Network
- Check API calls and responses
- Verify token is being sent in headers

### Port Already in Use
- Backend: `PORT=3000 npm run dev`
- Frontend: `VITE_PORT=5174 npm run dev`

## Performance Optimizations

- Code splitting with React lazy/Suspense
- Image optimization with Vite
- CSS purging with Tailwind
- API request caching
- Component memoization where needed

## Security Considerations

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days
- Environment variables never committed
- CORS configured for allowed origins
- Role checks on backend (not just frontend)
- Input validation on all endpoints

## Future Enhancements

- Real-time notifications (Socket.io)
- File attachments on tasks
- Task comments and activity feed
- Advanced filtering and search
- Export reports (PDF/CSV)
- Email notifications
- Dark/light mode toggle
- Multi-language support
- Task templates
- Recurring tasks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for team collaboration**
