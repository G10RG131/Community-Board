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
  // Create volunteer_registrations table
  pgm.createTable('volunteer_registrations', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    event_id: {
      type: 'uuid',
      notNull: true,
      references: 'events(id)',
      onDelete: 'CASCADE',
    },
    position_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    registered_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    }
  });

  // Create indexes for better performance
  pgm.createIndex('volunteer_registrations', 'user_id');
  pgm.createIndex('volunteer_registrations', 'event_id');
  pgm.createIndex('volunteer_registrations', ['event_id', 'position_name']);
  
  // Create unique constraint to prevent duplicate registrations
  pgm.createIndex('volunteer_registrations', ['user_id', 'event_id', 'position_name'], {
    unique: true,
    name: 'unique_user_event_position'
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the volunteer_registrations table
  pgm.dropTable('volunteer_registrations');
};
