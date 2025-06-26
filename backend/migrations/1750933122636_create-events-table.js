/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create events table
  pgm.createTable('events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: false,
    },
    date: {
      type: 'timestamptz',
      notNull: true,
    },
    location: {
      type: 'text',
      notNull: true,
    },
    organizer: {
      type: 'text',
      notNull: false,
    },
    image: {
      type: 'text',
      notNull: false,
    },
    volunteer_positions: {
      type: 'jsonb',
      notNull: false,
      default: '[]',
    },
    user_id: {
      type: 'integer',
      notNull: false,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Create indexes for better performance
  pgm.createIndex('events', 'date');
  pgm.createIndex('events', 'created_at');
  pgm.createIndex('events', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the events table (this reverses the migration)
  pgm.dropTable('events');
};
