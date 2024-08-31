import type { Express } from 'express';
import expressLoader from './express.js';
import { waitForDBConnection } from './sequelize/mysql.js';

// ** The Express Server Loader Function ** //
export default async function ({ app }: { app: Express }) {
  // appCache.flushAll();
  await expressLoader({ app });
  await waitForDBConnection();
  console.log('Express Server Intialized!');
  return app;
}
