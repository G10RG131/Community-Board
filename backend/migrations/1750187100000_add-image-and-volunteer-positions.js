exports.up = (pgm) => {
  // Add image column
  pgm.addColumn("events", {
    image: {
      type: "text",
      notNull: false,
    },
  });

  // Add volunteer_positions column as JSON array
  pgm.addColumn("events", {
    volunteer_positions: {
      type: "jsonb",
      notNull: false,
      default: "[]",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("events", "image");
  pgm.dropColumn("events", "volunteer_positions");
};
