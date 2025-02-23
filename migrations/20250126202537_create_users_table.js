import knex from 'knex';  // Default import

export const up = async function (knex) {
  return knex.schema
    .createTable('workouts', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
    })
    .createTable('workouts_exercises', (table) => {
      table.increments('id').primary();
      table.integer('workout_id').unsigned().references('id').inTable('workouts');
      table.string('exercise').notNullable();
    });
};

export const down = async function (knex) {
  return knex.schema
    .dropTableIfExists('workouts_exercises')
    .dropTableIfExists('workouts');
};
