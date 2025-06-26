exports.up = (pgm) => {
  pgm.createTable('volunteer_profiles', {
    id: { type: 'serial', primaryKey: true },
    user_id: { 
      type: 'integer', 
      references: 'users(id)', 
      notNull: true,
      onDelete: 'CASCADE'
    },
    skills: { type: 'text[]', notNull: true },
    age: { type: 'integer', notNull: true },
    gender: { type: 'varchar(50)', notNull: true },
    contact_email: { type: 'varchar(255)', notNull: true },
    created_at: { 
      type: 'timestamp', 
      notNull: true, 
      default: pgm.func('current_timestamp') 
    }
  });

  pgm.createIndex('volunteer_profiles', 'user_id', { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('volunteer_profiles');
};