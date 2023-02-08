import { knex } from "knex";

export const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./lib/db.sqlite",
  },
  useNullAsDefault: true,
});

export const createDatabase = async () => {
  await db.schema.dropTableIfExists('users');
  await db.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('firstName');
    table.string('lastName');
    table.string('email');
    table.string('password');
  });

  await db.schema.dropTableIfExists('categories');
  await db.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned();
    table.foreign('userId').references('users.id');
    table.string('name');
  });

  await db.schema.dropTableIfExists('days');
  await db.schema.createTable('days', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned();
    table.foreign('userId').references('users.id');
    table.timestamp('startDate').defaultTo(db.fn.now());
    table.timestamp('endDate').nullable();
  });

  await db.schema.dropTableIfExists('entries');
  await db.schema.createTable('entries', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned();
    table.foreign('userId').references('users.id');
    table.integer('categoryId').unsigned();
    table.foreign('categoryId').references('categories.id');
    table.integer('dayId').unsigned();
    table.foreign('dayId').references('days.id');
    table.timestamp('startDate').defaultTo(db.fn.now());
    table.timestamp('endDate').nullable();
  });
};

export const PASSWORD_SALT_ROUNDS = 10;
