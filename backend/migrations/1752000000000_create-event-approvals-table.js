/* migrations/1752000000000_create-event-approvals-table.js */
exports.up = (pgm) => {
    pgm.createTable('event_approvals', {
      id:    { type: 'serial', primaryKey: true },
      event_id:   { type: 'uuid', notNull: true, references: 'events(id)', onDelete: 'CASCADE' },
      admin_id:   { type: 'integer', notNull: true, references: 'users(id)' },
      action:     { type: 'varchar(20)', notNull: true },    // 'approved' | 'rejected'
      created_at: { type: 'timestamptz', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
    });
    pgm.createIndex('event_approvals', ['event_id']);
    pgm.createIndex('event_approvals', ['admin_id']);
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('event_approvals');
  };
  