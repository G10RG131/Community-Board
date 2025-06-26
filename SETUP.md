# Community Events Board - Setup Guide

This guide will help you set up the Community Events Board application from scratch, including automatic database creation and configuration.

## 🚀 Quick Start (Automated Setup)

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd Community-Board

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
copy .env.example .env  # Windows
# or
cp .env.example .env    # macOS/Linux
```

Edit the `.env` file with your PostgreSQL credentials:

```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password_here
PGDATABASE=community_board

# Application Configuration
NODE_ENV=development
PORT=5000

# JWT Configuration (generate a secure random string)
JWT_SECRET=your_jwt_secret_here
```

### 3. Automated Database Setup

The application includes automated database setup scripts that will:
- Create the database if it doesn't exist
- Run all migrations
- Optionally seed with test data

```bash
# From the backend directory
npm run db:init
```

This single command will:
✅ Create the `community_board` database if it doesn't exist
✅ Run all migrations to create tables
✅ Seed the database with test data
✅ Provide you with test user credentials

### 4. Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Test Login

Use the automatically created test account:
- **Email:** test@example.com
- **Password:** password123

## 🛠️ Manual Setup (Alternative)

If you prefer to set up the database manually:

### 1. Create Database Manually

```sql
-- Connect to PostgreSQL and create the database
CREATE DATABASE community_board;
```

### 2. Run Migrations Only

```bash
cd backend
npm run db:setup
```

### 3. Create Your Own User

Register through the application UI or use the API directly.

## 📊 Database Schema

The application creates the following tables:

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `role` (user/admin)
- `created_at`

### Events Table
- `id` (Primary Key)
- `title`
- `description`
- `date`
- `location`
- `organizer`
- `image` (URL)
- `volunteer_positions` (JSON)
- `user_id` (Foreign Key to users)
- `created_at`
- `updated_at`

### Volunteer Registrations Table
- `id` (Primary Key)
- `user_id` (Foreign Key to users)
- `event_id` (Foreign Key to events)
- `position_name`
- `registered_at`

## 🔧 Development Commands

### Backend Commands
```bash
# Start development server with auto-reload
npm run dev

# Build the TypeScript project
npm run build

# Start production server
npm start

# Create a new migration
npm run migrate:create <migration_name>

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:down

# Setup database (create + migrate)
npm run db:setup

# Full development setup (create + migrate + seed)
npm run db:init

# Run tests
npm test
```

### Frontend Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌱 Test Data

The automated setup creates:

**Test User:**
- Email: test@example.com
- Password: password123
- Role: user

**Sample Events:**
- Community Cleanup Day (with volunteer positions)
- Food Drive (with volunteer positions)

## 🔍 Troubleshooting

### Database Connection Issues

1. **PostgreSQL not running:**
   ```bash
   # Windows (if installed as service)
   net start postgresql-x64-14
   
   # macOS (with Homebrew)
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Wrong credentials:**
   - Check your `.env` file
   - Verify PostgreSQL user and password
   - Ensure the database user has CREATE DATABASE privileges

3. **Database already exists but corrupted:**
   ```bash
   # Drop and recreate (WARNING: This deletes all data)
   dropdb community_board
   npm run db:init
   ```

### Migration Issues

1. **Migration table locked:**
   ```bash
   # Check for running migrations
   ps aux | grep migrate
   
   # If needed, restart PostgreSQL service
   ```

2. **Migration failed mid-way:**
   ```bash
   # Check migration status
   npm run migrate

   # If needed, rollback and retry
   npm run migrate:down
   npm run migrate
   ```

### Port Conflicts

If ports 3000 or 5000 are already in use:

1. **Change backend port:**
   - Update `PORT` in `.env`
   - Update frontend API calls in `src/utils/api.js`

2. **Change frontend port:**
   ```bash
   # Set different port
   PORT=3001 npm start
   ```

## 🚀 Production Deployment

For production deployment, additional steps are needed:

1. Set `NODE_ENV=production` in environment
2. Configure SSL settings in database config
3. Use proper JWT secrets
4. Set up reverse proxy (nginx/Apache)
5. Configure CORS for production domain

## 📝 API Documentation

The backend provides the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (authenticated)
- `PUT /api/events/:id` - Update event (owner only)
- `DELETE /api/events/:id` - Delete event (owner only)
- `GET /api/events/:id` - Get specific event details

### Volunteers
- `POST /api/events/:id/volunteers` - Register as volunteer
- `DELETE /api/events/:id/volunteers` - Unregister from event
- `GET /api/events/:id/volunteers` - Get event volunteers

For detailed API documentation, see the route files in `backend/src/routes/`.
