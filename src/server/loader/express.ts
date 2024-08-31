import dotenv from 'dotenv';
import type { Express, Response } from 'express';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../loader/config/expressENV.js';
import setUpMiddlewares from './middlewares/cors.js';
import { router } from './routes/router.js';

dotenv.config();

export default async function ({ app }: { app: Express }) {
  setUpMiddlewares({ app });
  const Trust_Proxy = env.TRUST_PROXY || 'false';
  const numberOfProxies = env.NUMBER_OF_PROXIES || 1;
  if (Trust_Proxy) {
    app.set('trust proxy', true);
  } else if (Trust_Proxy === 'false') {
    app.set('trust proxy', false);
  } else {
    app.set('trust proxy', Trust_Proxy);
    app.set('trust proxy', numberOfProxies);
  }
  app.set('trust proxy', numberOfProxies);

  app.get('/ip', (request, response) => response.send(request.ip));

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(helmet.xssFilter());

  app.use(helmet.frameguard());

  app.use(morgan(env.MORGAN));

  app.use(router);

  const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res: Response, path: any, stat: any) {
      const ext = path.extname(path);
      if (ext === '.html') {
        res.set('x-timestamp', Date.now().toString());
      }
      const statObj = stat;
      if (statObj.isFile()) {
        res.set('x-filesize', statObj.size);
      }
    },
  };

  // // Set views and public directories
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, 'dist'), options));

  app.use(express.static(path.join(__dirname, 'public'), options));

  app.use('/assets', express.static(path.join(__dirname, 'assets'), options));

  // Serve static assets from the build directory
  app.use(express.static(path.join(__dirname, 'build'), options));

  // Route for the main app
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  return app;
}
