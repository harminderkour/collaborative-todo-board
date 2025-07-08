# TaskFlow - Real-Time Collaborative To-Do Board

A full-stack web application for real-time collaborative task management, built with Next.js, Node.js, and Socket.IO.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Real-Time Collaboration**: Live updates using WebSockets (Socket.IO)
- **Kanban Board**: Drag-and-drop task management with Todo, In Progress, and Done columns
- **Smart Assignment**: Automatically assign tasks to users with the fewest active tasks
- **Conflict Resolution**: Handle simultaneous edits with conflict detection and resolution
- **Activity Logging**: Track all user actions with real-time activity feed
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Custom Animations**: Smooth transitions and hover effects

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/taskflow-collaborative-todo.git
cd taskflow-collaborative-todo
\`\`\`

### 2. Install Frontend Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Install Backend Dependencies
\`\`\`bash
npm install express socket.io cors jsonwebtoken bcryptjs
\`\`\`

### 4. Environment Variables
Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
JWT_SECRET=your-super-secret-jwt-key-here
\`\`\`

### 5. Start the Backend Server
\`\`\`bash
node server.js
\`\`\`
The backend server will run on `http://localhost:5000`

### 6. Start the Frontend Development Server
\`\`\`bash
npm run dev
\`\`\`
The frontend will run on `http://localhost:3000`

## 🎯 Usage Guide

### Getting Started
1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: Access the main Kanban board interface

### Task Management
- **Create Task**: Click "Add Task" to create a new task with title, description, priority, and assignee
- **Edit Task**: Click on any task to modify its details
- **Drag & Drop**: Move tasks between columns (Todo, In Progress, Done)
- **Smart Assign**: Use the lightning bolt icon to automatically assign tasks to the user with the fewest active tasks
- **Delete Task**: Remove tasks that are no longer needed

### Real-Time Features
- **Live Updates**: See changes made by other users instantly
- **Activity Log**: View the last 20 actions performed by all users
- **Conflict Resolution**: Handle simultaneous edits with merge options

## 🧠 Smart Logic Implementation

### Smart Assignment Algorithm
The Smart Assign feature automatically assigns tasks to the user with the fewest active (non-completed) tasks:

1. **Count Active Tasks**: Calculate active tasks for each user (excluding "Done" status)
2. **Find Minimum**: Identify the user(s) with the lowest task count
3. **Assign Task**: Automatically assign the task to the user with the fewest responsibilities
4. **Load Balancing**: Ensures even distribution of work across team members

### Conflict Handling System
When multiple users edit the same task simultaneously:

1. **Detection**: Server detects conflicts based on last modification timestamp
2. **Notification**: Both users are notified of the conflict
3. **Resolution Options**:
   - **Keep Your Version**: Discard other user's changes
   - **Accept Their Version**: Discard your changes
   - **Merge Changes**: Manually combine both versions field by field
4. **Validation**: Ensure data integrity after conflict resolution

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with secure tokens
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Configured Cross-Origin Resource Sharing
- **Socket Authentication**: Secure WebSocket connections with token verification

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with drag-and-drop
- **Tablet**: Touch-friendly interface with optimized layouts
- **Mobile**: Streamlined UI for small screens

## 🎨 Custom Animations

- **Card Hover Effects**: Smooth scale and shadow transitions
- **Drag & Drop**: Visual feedback during task movement
- **Loading States**: Elegant loading spinners and skeleton screens
- **Page Transitions**: Smooth navigation between views

## 🚀 Deployment Instructions

### Frontend Deployment (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend Deployment (Railway/Render)
1. Create account on Railway or Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the Node.js application

### Environment Variables for Production
\`\`\`env
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
JWT_SECRET=your-production-jwt-secret
PORT=5000
\`\`\`

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Task creation, editing, and deletion
- [ ] Real-time updates across multiple browser tabs
- [ ] Smart assignment functionality
- [ ] Conflict resolution workflow
- [ ] Activity logging accuracy
- [ ] Responsive design on different devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Socket.IO for real-time communication
- Tailwind CSS for the utility-first approach
- Lucide for beautiful icons

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/taskflow-collaborative-todo/issues) page
2. Create a new issue with detailed description
3. Contact the development team

---

**Live Demo**: [https://your-deployed-app.vercel.app](https://your-deployed-app.vercel.app)
**Demo Video**: [https://your-demo-video-link.com](https://your-demo-video-link.com)
