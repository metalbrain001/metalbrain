import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import http from 'node:http';
import process from 'node:process';
import { env } from './loader/config/expressENV.js';

dotenv.config();

async function StartServer() {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  (await import('./loader/index.js')).default({ app });

  const server = http.createServer(app);

  const asyncLocalStorage = new AsyncLocalStorage();

  function logWithId(msg: unknown) {
    const id = asyncLocalStorage.getStore();
    console.log(`${id !== undefined ? id : '-'} ${msg}`);
  }

  let idSeq = 0;
  server.on('connection', socket => {
    const id = idSeq++;
    asyncLocalStorage.run(id, () => {
      logWithId('Client connected to server!!!');
      socket.on('close', () => {
        logWithId('Client disconnected from server!!!');
      });
    });
  });

  server.listen(env.PORT, '127.0.0.1', () => {
    console.log(`Server listening on port ${env.PORT}`);
  });

  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: env.COMPRESSION_LEVEL || 9,
      threshold: env.COMPRESSION_THRESHOLD || 1024,
    })
  );

  const idleTimeout = env.IDLE_TIMEOUT || 480000;
  let idleTimer = setTimeout(() => {
    server.close(() => {
      console.log('Server closed due to idle time out! Restarting....');
      process.exit(0);
    });
  }, idleTimeout);

  app.use((_req, _res, next) => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      server.close(() => {
        console.log('Cleared Time out! Restarting....');
        process.exit(0);
      });
    }, idleTimeout);
    next();
  });

  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exception:', err, 'Origin:', origin);
    process.exit(1);
  });

  server.on('error', error => {
    console.error(error);
    process.exit(1);
  });
}

StartServer();
