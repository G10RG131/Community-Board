/* migrations/1751000000000_add_event_status_and_admins.js */
exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = pgm => {
  // 1) Add moderation fields to events
  pgm.addColumns('events', {
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: `'pending'`
    },
    submitted_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP')
    },
    approved_by: {
      type: 'integer',
      references: 'users(id)',
      onDelete: 'SET NULL'
    }
  });
  // Index the new columns for fast lookups
  pgm.createIndex('events', 'status');
  pgm.createIndex('events', 'submitted_at');

  // 2) Ensure every user has a role (idempotent: only adds if missing)
  pgm.sql(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role varchar(20)
        NOT NULL
        DEFAULT 'user';
  `);

  // 3) Seed a default admin user
  pgm.sql(`
    INSERT INTO users (name, email, password, role)
    VALUES ('Site Admin', 'admin@example.com', 'changeme', 'admin')
    ON CONFLICT (email) DO NOTHING;
  `);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = pgm => {
  // Drop only what we added to events
  pgm.dropIndex('events', 'submitted_at');
  pgm.dropIndex('events', 'status');
  pgm.dropColumns('events', ['status', 'submitted_at', 'approved_by']);
  
  // Note: we leave the users.role column and admin user intact
};
