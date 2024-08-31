import { strict as assert } from 'assert';
import { load } from 'ts-dotenv';

// Load the .env file
const data_schema_env = load({
  DB_HOST: String,
  DB_PORT: Number,
  DB_USER: String,
  DB_PASSWORD: String,
  DB_NAME: String,
  DB_DIALECT: String,
});

// deconstruct the env object
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT } =
  data_schema_env;

// Validate the environment variables
assert(DB_HOST, 'DB_HOST is required');
assert(DB_PORT, 'DB_PORT is required');
assert(DB_USER, 'DB_USER is required');
assert(DB_PASSWORD, 'DB_PASSWORD is required');
assert(DB_NAME, 'DB_NAME is required');
assert(DB_DIALECT == 'mysql', 'DB_DIALECT is required');

// Export the environment variables
export const dbENV = {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT,
};

export default {
  dbENV,
  mysql: {
    host: dbENV.DB_HOST,
    port: dbENV.DB_PORT,
    user: dbENV.DB_USER,
    password: dbENV.DB_PASSWORD,
    database: dbENV.DB_NAME,
    dialect: dbENV.DB_DIALECT,
  },
};
