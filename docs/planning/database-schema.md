# Database Schema Design

## Overview
This document outlines the database schema for the Community Events Board application.

## Tables

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  password_hash TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

**Indexes:**
- `users_email_index` on `email`
- `users_username_index` on `username`
- `users_created_at_index` on `created_at`

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT,
  image TEXT,
  volunteer_positions JSONB DEFAULT '[]',
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

**Indexes:**
- `events_date_index` on `date`
- `events_created_at_index` on `created_at`
- `events_user_id_index` on `user_id`

### Volunteer Registrations Table
```sql
CREATE TABLE volunteer_registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  position_name VARCHAR(255) NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(user_id, event_id, position_name)
);
```

**Indexes:**
- `volunteer_registrations_user_id_index` on `user_id`
- `volunteer_registrations_event_id_index` on `event_id`
- `volunteer_registrations_event_position_index` on `(event_id, position_name)`
- `unique_user_event_position` UNIQUE on `(user_id, event_id, position_name)`

## Relationships

### One-to-Many Relationships
- **Users → Events**: One user can create many events
- **Events → Volunteer Registrations**: One event can have many volunteer registrations
- **Users → Volunteer Registrations**: One user can register for many volunteer positions

### Data Types

#### UUID vs Serial
- **Events**: Use UUID for better distribution and security
- **Users/Registrations**: Use SERIAL for simplicity and performance

#### JSONB for Volunteer Positions
```json
[
  { "name": "Setup Crew", "count": 5 },
  { "name": "Cleanup Crew", "count": 3 },
  { "name": "Registration Desk", "count": 2 }
]
```

## Migration Strategy

### Migration Order
1. Create users table
2. Create events table
3. Create volunteer_registrations table
4. Add foreign key constraints

### Sample Data Structure
```sql
-- Sample user
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2b$10$...');

-- Sample event
INSERT INTO events (title, description, date, location, user_id) VALUES 
('Community Cleanup', 'Help clean our park', '2025-07-01 10:00:00', 'Central Park', 1);

-- Sample volunteer registration
INSERT INTO volunteer_registrations (user_id, event_id, position_name) VALUES 
(1, 'event-uuid', 'Setup Crew');
```

## Performance Considerations

### Indexing Strategy
- Index on frequently queried columns (email, date, user_id)
- Composite indexes for complex queries
- Unique constraints to prevent data duplication

### Query Optimization
- Use prepared statements
- Limit result sets with pagination
- Use JSONB operators for volunteer position queries

## Security Considerations

### Data Protection
- Hash passwords with bcrypt
- Use UUIDs for public-facing IDs
- Implement proper foreign key constraints

### Access Control
- Role-based access (user/admin)
- User can only modify their own events
- Cascade deletes for data integrity
