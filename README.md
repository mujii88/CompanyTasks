# Task Management Application

A full-stack web application for task management with role-based access control. Built with Node.js, Express, MongoDB, React, and TailwindCSS.

## Features

### Backend Features
- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with role-based access control
- **User Management** with manager and employee roles
- **Task Management** with CRUD operations
- **Progress Tracking** (0-100%)
- **Task Statistics** and analytics

### Frontend Features
- **React** with modern hooks and context
- **TailwindCSS** for beautiful, responsive UI
- **Role-based Dashboards** (Manager/Employee)
- **Real-time Updates** with toast notifications
- **Progress Bars** and visual task status
- **Mobile-responsive** design

### User Roles

#### Manager
- Create, edit, and delete tasks
- Assign tasks to employees
- View all tasks and statistics
- Update task progress and details
- Manage employee information

#### Employee
- View assigned tasks only
- Update task progress
- See task deadlines and priorities
- Track personal task statistics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Database Setup**
   
   Make sure MongoDB is running locally, or update the `MONGODB_URI` to point to your MongoDB instance.

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend application**
   ```bash
   cd client
   npm start
   ```
   The React app will start on `http://localhost:3000`

### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task (managers only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (managers only)
- `GET /api/tasks/stats/overview` - Get task statistics (managers only)

### Users
- `GET /api/users/employees` - Get all employees (managers only)
- `GET /api/users` - Get all users (managers only)
- `GET /api/users/:id` - Get user by ID (managers only)

## Project Structure

```
task-management-app/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config.env         # Environment variables
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── client/                # Frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   ├── tailwind.config.js # TailwindCSS configuration
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Manager Dashboard**: 
   - Create new tasks and assign them to employees
   - View all tasks and their progress
   - Monitor task statistics and analytics
   - Edit or delete tasks as needed
3. **Employee Dashboard**:
   - View assigned tasks
   - Update task progress using the progress slider
   - Monitor personal task statistics

## Features in Detail

### Task Management
- **Title & Description**: Detailed task information
- **Assignee**: Assign tasks to specific employees
- **Deadline**: Set due dates for tasks
- **Priority**: Low, Medium, High priority levels
- **Progress**: 0-100% progress tracking
- **Status**: Automatic status updates based on progress
- **Overdue Detection**: Visual indicators for overdue tasks

### Security
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for managers and employees
- **Password Hashing**: Secure password storage with bcrypt
- **Input Validation**: Server-side validation for all inputs

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Toast notifications for all actions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error handling and user feedback
- **Modern UI**: Clean, intuitive interface with TailwindCSS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@taskmanagement.com or create an issue in the repository.
