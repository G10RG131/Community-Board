exports.up = function(pgm) {
  pgm.addColumn('volunteer_profiles', {
    is_public: { type: 'boolean', default: true, notNull: true }
  });
};

exports.down = function(pgm) {
  pgm.dropColumn('volunteer_profiles', 'is_public');
};