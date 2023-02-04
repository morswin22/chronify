import { knex } from "knex";

export const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./lib/db.sqlite",
  },
  useNullAsDefault: true,
});

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const PASSWORD_SALT_ROUNDS = 10;
