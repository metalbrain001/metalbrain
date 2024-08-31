import { Sequelize } from 'sequelize';
import { dbENV } from './dbENV.js';

// ** Database Configuration
interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  dialect: 'mysql';
}

// ** Database further configuration
const mysql: DBConfig = {
  host: dbENV.DB_HOST,
  port: dbENV.DB_PORT,
  user: dbENV.DB_USER,
  password: dbENV.DB_PASSWORD,
  database: dbENV.DB_NAME,
  dialect: 'mysql',
};

// ** Sequelize Connection
export function sequelizeConInstance(): Sequelize {
  const sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
    host: mysql.host,
    port: mysql.port,
    dialect: 'mysql',
  });
  return sequelize;
}

export default { sequelizeConInstance };
