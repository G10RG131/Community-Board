# Community Events Board - Project Specifications

## 📋 Project Overview

The Community Events Board is a full-stack web application that enables community members to create, manage, and volunteer for local events. The application features user authentication, event management, and volunteer registration capabilities.

## 🏗️ Repository Structure

### Root Directory
```
Community-Board/
├── frontend/                 # React frontend application
├── backend/                  # Node.js backend API
├── docs/                     # Documentation and planning materials
├── shared/                   # Shared types and utilities (future enhancement)
├── .gitignore               # Git ignore rules
├── README.md                # Project overview and quick start
├── SETUP.md                 # Detailed setup instructions
├── SPECIFICATIONS.md        # This document
├── setup.ps1               # Windows PowerShell setup script
└── setup.bat               # Windows batch setup script
```

### Frontend Structure (`/frontend/`)
```
frontend/
├── public/                  # Static assets
│   ├── index.html          # Main HTML template
│   └── favicon.ico         # Site favicon
├── src/                    # React source code
│   ├── components/         # Reusable React components
│   │   ├── Auth/          # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── LoginForm.css
│   │   │   ├── RegisterForm.jsx
│   │   │   └── RegisterForm.css
│   │   ├── EventCard/     # Event display component
│   │   │   ├── EventCard.jsx
│   │   │   └── EventCard.css
│   │   └── Navbar/        # Navigation component
│   │       ├── Navbar.jsx
│   │       └── Navbar.css
│   ├── pages/             # Page-level components
│   │   ├── AdminDashboard.jsx
│   │   ├── EventsPage.jsx
│   │   ├── EventDetailsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── MyEventsPage.jsx
│   │   ├── PendingEvents.jsx
│   │   ├── VolunteerPage.jsx
│   │   └── [corresponding .css files]
│   ├── utils/             # Utility functions
│   │   └── api.js         # API communication helpers
│   ├── App.jsx            # Main application component
│   ├── App.css            # Main application styles
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── package-lock.json      # Locked dependency versions
```

### Backend Structure (`/backend/`)
```
backend/
├── src/                   # TypeScript source code
│   ├── routes/           # API route handlers
│   │   ├── auth.ts       # Authentication endpoints
│   │   ├── events.ts     # Event CRUD endpoints
│   │   └── volunteers.ts # Volunteer management endpoints
│   ├── types/            # TypeScript type definitions
│   │   ├── event.ts      # Event-related types
│   │   ├── user.ts       # User-related types
│   │   └── volunteer.ts  # Volunteer-related types
│   ├── data/             # Data access layer
│   │   ├── eventsStore.ts    # Event database operations
│   │   ├── usersStore.ts     # User database operations
│   │   └── volunteerStore.ts # Volunteer database operations
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Authentication middleware
│   │   ├── errorHandler.ts  # Error handling
│   │   └── validateBody.ts  # Request validation
│   ├── __tests__/        # Test files
│   │   └── events.spec.ts
│   ├── app.ts            # Express application setup
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── migrations/           # Database migrations
│   ├── 1750933246077_create-users-table.js
│   ├── 1750933122636_create-events-table.js
│   └── 1750933252802_create-volunteer-registrations-table.js
├── scripts/              # Utility scripts
│   ├── setup-database.js    # Database creation and migration
│   ├── setup-dev.js         # Development environment setup
│   └── init-database.js     # Database initialization
├── .env.example          # Environment variables template
├── .env                  # Environment variables (not in git)
├── migrations-config.js  # Migration configuration
├── jest.config.js        # Test configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── package-lock.json     # Locked dependency versions
```

### Documentation Structure (`/docs/`)
```
docs/                      # Project documentation
├── planning/             # Planning and design materials
│   ├── user-stories.md   # User requirements
│   ├── database-schema.md # Database design
│   └── api-design.md     # API specification
├── deployment/           # Deployment guides
│   ├── aws-deployment.md
│   ├── docker-setup.md
│   └── production-checklist.md
├── development/          # Development guides
│   ├── coding-standards.md
│   ├── testing-guide.md
│   └── troubleshooting.md
└── assets/               # Documentation assets
    ├── screenshots/
    ├── diagrams/
    └── mockups/
```

### Shared Types Structure (`/shared/`) - Future Enhancement
```
shared/                   # Shared utilities (future)
├── types/               # Shared TypeScript types
│   ├── api.ts          # API response/request types
│   ├── common.ts       # Common utility types
│   └── database.ts     # Database entity types
├── utils/              # Shared utility functions
│   ├── validation.ts   # Common validation logic
│   ├── formatting.ts   # Data formatting utilities
│   └── constants.ts    # Application constants
└── package.json        # Shared package configuration
```

## 🌿 Git Branching Strategy

### Branch Types

#### 1. **Main Branch (`main`)**
- **Purpose**: Production-ready, stable code
- **Protection**: Always protected, requires pull request reviews
- **Deployment**: Automatically deploys to production
- **Merge Policy**: Only feature branches and hotfixes can merge here

#### 2. **Feature Branches (`feature/*`)**
- **Naming**: `feature/description-of-feature`
- **Examples**: 
  - `feature/user-authentication`
  - `feature/event-search-filter`
  - `feature/volunteer-dashboard`
- **Purpose**: Development of new features
- **Lifespan**: Created from `main`, merged back to `main` when complete
- **Testing**: Must pass all tests before merging

#### 3. **Bug Fix Branches (`bugfix/*`)**
- **Naming**: `bugfix/description-of-bug`
- **Examples**:
  - `bugfix/login-validation-error`
  - `bugfix/event-date-display`
- **Purpose**: Fix non-critical bugs
- **Lifespan**: Short-lived, merged quickly after fix

#### 4. **Hotfix Branches (`hotfix/*`)**
- **Naming**: `hotfix/critical-issue-description`
- **Examples**:
  - `hotfix/security-vulnerability`
  - `hotfix/database-connection-error`
- **Purpose**: Critical production fixes
- **Urgency**: Can be merged directly to main with expedited review

### Workflow Process

#### Feature Development Workflow
```bash
# 1. Create and switch to feature branch
git checkout main
git pull origin main
git checkout -b feature/new-feature-name

# 2. Develop and commit changes
git add .
git commit -m "feat: add new feature description"

# 3. Push branch and create pull request
git push origin feature/new-feature-name
# Create PR through GitHub/GitLab interface

# 4. After review and approval, merge to main
# Delete feature branch after merge
```

#### Hotfix Workflow
```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# 2. Fix and commit
git add .
git commit -m "hotfix: fix critical issue description"

# 3. Push and create urgent PR
git push origin hotfix/critical-issue
# Create PR with "urgent" label
```

### Commit Message Conventions

#### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Examples
```bash
feat(auth): add user registration functionality
fix(events): resolve date formatting issue in event cards
docs(readme): update installation instructions
refactor(api): reorganize route handlers
test(auth): add unit tests for login validation
chore(deps): update dependencies to latest versions
```

## 🔄 Development Workflow

### 1. **Setup Phase**
- Clone repository
- Run setup scripts (`npm run db:init`)
- Create feature branch
- Start development servers

### 2. **Development Phase**
- Write code following established patterns
- Write tests for new functionality
- Commit changes with descriptive messages
- Push to feature branch regularly

### 3. **Testing Phase**
- Run automated tests: `npm test`
- Manual testing in development environment
- Cross-browser testing (frontend)
- API testing (backend)

### 4. **Review Phase**
- Create pull request with detailed description
- Code review by team members
- Address feedback and make changes
- Final approval and merge

### 5. **Deployment Phase**
- Automatic deployment to staging (feature branches)
- Manual deployment to production (main branch)
- Monitor application health
- Rollback if issues detected

## 📦 Package Management

### Dependency Categories

#### Frontend Dependencies
- **React**: UI framework
- **React Router**: Client-side routing
- **Bootstrap**: CSS framework
- **Axios**: HTTP client

#### Backend Dependencies
- **Express**: Web framework
- **PostgreSQL**: Database driver
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **zod**: Runtime validation
- **node-pg-migrate**: Database migrations

#### Development Dependencies
- **TypeScript**: Type safety
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with Jest/React Testing Library
- **Integration Tests**: Page-level functionality testing
- **E2E Tests**: Critical user flows (future enhancement)

### Backend Testing
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Data layer testing

### Test Coverage Goals
- **Minimum**: 70% code coverage
- **Target**: 85% code coverage
- **Critical Paths**: 95% coverage (auth, payments, data integrity)

## 🚀 Deployment Strategy

### Environments

#### Development
- **Purpose**: Local development
- **Database**: Local PostgreSQL
- **API**: localhost:5000
- **Frontend**: localhost:3000

#### Staging (Future)
- **Purpose**: Integration testing
- **Database**: Staging PostgreSQL
- **URL**: staging.community-board.com
- **Auto-deploy**: From feature branches

#### Production
- **Purpose**: Live application
- **Database**: Production PostgreSQL
- **URL**: community-board.com
- **Deploy**: Manual from main branch

## 📋 Code Standards

### General Principles
- **Consistency**: Follow established patterns
- **Readability**: Clear, self-documenting code
- **Modularity**: Small, focused functions/components
- **Testing**: Write tests for new functionality

### File Naming Conventions
- **React Components**: PascalCase (`EventCard.jsx`)
- **Utilities**: camelCase (`apiHelpers.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)
- **Database**: snake_case (`user_events.sql`)

### Code Organization
- Group related functionality together
- Separate concerns (UI, business logic, data access)
- Use meaningful variable and function names
- Add comments for complex logic

## 🔐 Security Considerations

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Secure cookie handling
- Rate limiting on auth endpoints

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Environment Security
- Environment variables for secrets
- Secure database connections
- HTTPS in production
- Regular dependency updates

## 📈 Future Enhancements

### Phase 2 Features
- Email notifications
- Event categories and filtering
- Image upload functionality
- Admin dashboard improvements
- Mobile responsive optimizations

### Phase 3 Features
- Real-time notifications
- Event recurring functionality
- Integration with calendar apps
- Advanced user roles and permissions
- Analytics and reporting

### Technical Improvements
- GraphQL API implementation
- React Native mobile app
- Microservices architecture
- Docker containerization
- CI/CD pipeline implementation

---

**Document Version**: 1.0  
**Last Updated**: June 26, 2025  
**Maintainer**: Development Team
