require('dotenv').config();

const mysql = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
}

module.exports = {
  development: {
    username: mysql.DB_USER,
    password: mysql.DB_PASSWORD,
    database: mysql.DB_NAME,
    host: mysql.DB_HOST,
    port: mysql.DB_PORT,
    dialect: 'mysql',
    migrationStorageTableName: "sequelize",
    migration: "sequelize",
  },
  test: {
    username: mysql.DB_USER,
    password: mysql.DB_PASSWORD,
    database: mysql.DB_NAME,
    host: mysql.DB_HOST,
    port: mysql.DB_PORT,
    dialect: 'mysql'
  },
  production: {
    username: mysql.DB_USER,
    password: mysql.DB_PASSWORD,
    database: mysql.DB_NAME,
    host: mysql.DB_HOST,
    port: mysql.DB_PORT,
    dialect: 'mysql'
  }
};