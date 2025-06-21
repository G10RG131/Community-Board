exports.up = (pgm) => {
    pgm.createExtension("pgcrypto", { ifNotExists: true });
    pgm.createTable(
      "events",
      {
        id: {
          type: "uuid",
          primaryKey: true,
          default: pgm.func("gen_random_uuid()"),
        },
        title: { type: "text", notNull: true },
        date: { type: "timestamptz", notNull: true },
        location: { type: "text", notNull: true },
        description: { type: "text" },
      },
      { ifNotExists: true }
    );
  };
  
  exports.down = (pgm) => {
    pgm.dropTable("events", { ifExists: true });
  };
  