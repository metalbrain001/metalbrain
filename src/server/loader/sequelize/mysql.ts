import { Sequelize } from 'sequelize';
import { sequelizeConInstance } from './sequelizeCon.js';

// ** MySQL Connection
export async function waitForDBConnection(): Promise<Sequelize> {
  const sequelize = sequelizeConInstance();
  const maxRetries = 10;
  const delay = 5000;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync({ force: true });
      console.log('Drop and re-sync all models.');
      return sequelize;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      retries++;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  if (!sequelize) {
    throw new Error('Unable to connect to the database');
  } else {
    return sequelize;
  }
}

export default waitForDBConnection;
