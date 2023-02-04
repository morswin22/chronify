import { knex } from "knex";

export const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./lib/db.sqlite",
  },
  useNullAsDefault: true,
});
