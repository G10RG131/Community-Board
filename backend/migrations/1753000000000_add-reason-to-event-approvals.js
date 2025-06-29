// migrations/1753000000000_add-reason-to-event-approvals.js
exports.up = (pgm) => {
    pgm.addColumn('event_approvals', {
      reason: { type: 'text', notNull: false }
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropColumn('event_approvals', 'reason');
  };