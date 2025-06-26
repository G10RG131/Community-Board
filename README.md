# 🗓️ Community Events Board

A full-stack community events board application where users can create, manage, and volunteer for local events. Built with **React**, **Node.js**, **PostgreSQL**, and **TypeScript** with user authentication and volunteer management.

---

## ✨ Features

- **User Authentication** - Register, login, and manage user accounts
- **Event Management** - Create, edit, and delete your own events  
- **Volunteer Registration** - Sign up for volunteer positions at events
- **Real-time Updates** - See volunteer registrations update in real-time
- **Responsive Design** - Bootstrap-powered UI that works on all devices
- **Database Automation** - Automatic database setup and migrations

---

## 🚀 Quick Setup (Automated)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)

### Option 1: Windows Setup Scripts

**PowerShell (Recommended):**
```powershell
# Run from the project root
.\setup.ps1
```

**Batch file:**
```cmd
# Run from the project root
setup.bat
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend  
   cd ../frontend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Setup Database**
   ```bash
   # From backend directory
   npm run db:init
   ```

4. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Test Login: test@example.com / password123

---

## 🏗️ Project Structure

```
Community-Board/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── types/          # TypeScript type definitions
│   │   ├── data/           # Data access layer
│   │   └── middleware/     # Express middleware
│   ├── migrations/         # Database migrations
│   ├── scripts/           # Setup and utility scripts
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page-level components
│   │   └── utils/         # Utility functions
│   └── package.json
├── setup.ps1             # Windows PowerShell setup script
├── setup.bat             # Windows batch setup script
├── SETUP.md              # Detailed setup guide
└── README.md             # This file
```

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety and better development experience
- **PostgreSQL** - Relational database
- **node-pg-migrate** - Database migrations
- **bcrypt** - Password hashing
- **Zod** - Runtime type validation

### Frontend  
- **React** - UI framework
- **Bootstrap** - CSS framework for responsive design
- **React Router** - Client-side routing

## 🎯 Key Features

### Authentication System
- User registration and login
- JWT-based authentication
- Role-based access (user/admin)
- Protected routes and API endpoints

### Event Management
- Create events with details and volunteer positions
- Edit and delete your own events
- View all community events
- Image support for events

### Volunteer System
- Register for volunteer positions
- View volunteer registrations
- Automatic cleanup when positions are removed
- Real-time volunteer count updates

### User Dashboard
- View and manage your created events
- See your volunteer registrations
- Edit event details and volunteer positions

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **events** - Community events with details
- **volunteer_registrations** - Volunteer sign-ups for events

Migrations are automatically handled and include proper foreign key relationships and constraints.

## 🔧 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run db:setup     # Create database and run migrations
npm run db:init      # Full setup with test data
npm run migrate      # Run pending migrations
npm test            # Run tests
```

### Frontend Scripts
```bash
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

## 🌱 Test Data

The automated setup includes:
- Test user account (test@example.com / password123)
- Sample community events
- Volunteer positions for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [SETUP.md](SETUP.md) for detailed troubleshooting
2. Ensure PostgreSQL is running and credentials are correct
3. Verify Node.js and npm versions meet requirements
4. Check that all dependencies are installed

For additional help, please open an issue in the repository.

