exports.up = (pgm) => {
  pgm.createTable(
    "users",
    {
      id: {
        type: "serial",
        primaryKey: true,
      },
      name: { 
        type: "varchar(255)", 
        notNull: true 
      },
      email: { 
        type: "varchar(255)", 
        notNull: true, 
        unique: true 
      },
      password: { 
        type: "text", 
        notNull: true 
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("current_timestamp"),
      },
      updated_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("current_timestamp"),
      },
    },
    { ifNotExists: true }
  );
  
  // Create index on email for faster lookups
  pgm.createIndex("users", "email", { unique: true, ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable("users", { ifExists: true });
};
