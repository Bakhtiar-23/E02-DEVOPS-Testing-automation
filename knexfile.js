import knex from 'knex';  // Use the default import here as well


// Initialize Knex with the config
const db = Knex({
  client: 'sqlite3',
  connection: {
    filename: './workout-dev.sqlite',
  },
  useNullAsDefault: true, // For SQLite3
});
