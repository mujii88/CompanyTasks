# 📋 CompanyTasks - Task Management System

A modern, responsive task management application built with React.js. Perfect for teams to manage tasks efficiently with role-based access control.

## 🚀 Live Demo
**Try it now:** https://companytasks-app-demo.surge.sh

## ✨ Features
- **Manager Dashboard** - Create and assign tasks to employees
- **Employee Dashboard** - View and update assigned tasks  
- **Beautiful UI** - Modern design with smooth animations
- **Role-based Access** - Different views for managers and employees
- **Progress Tracking** - Real-time task progress updates
- **Local Storage** - No backend required, works offline

## 🛠️ Quick Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd CompanyTasks/client
npm install
```

### 2. Run Locally
```bash
npm start
```
Open http://localhost:3000

### 3. Build for Production
```bash
npm run build
```

## 📱 How to Use

1. **Register** - Choose Manager or Employee role
2. **Manager**: Create tasks, assign to employees, monitor progress
3. **Employee**: View assigned tasks, update progress, mark complete

## 🎯 Tech Stack
- React.js + React Router
- Tailwind CSS for styling
- Lucide React icons
- Local Storage for data persistence

## 📦 Project Structure
```
CompanyTasks/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── contexts/    # React contexts
│   │   └── ...
└── server/          # Backend (optional)
```

## 🚀 Deploy Your Own
```bash
# Build the app
npm run build

# Deploy to Surge (or any static host)
npm install -g surge
surge ./build your-domain.surge.sh
```

---
**Ready to manage tasks efficiently? Start now! 🎉**

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
