import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const allowList = ['http://localhost:5173'];

const corsOptionDelegate = function (req: express.Request, callback: any) {
  let corsOptions: cors.CorsOptions;

  if (allowList.indexOf(req.header('Origin') || '') !== -1) {
    corsOptions = {
      origin: 'http://localhost:5173',
      credentials: true,
      optionsSuccessStatus: 200,
    };
  } else {
    corsOptions = {
      origin: false,
      credentials: true,
    };
  }
  callback(null, corsOptions);
};

export default async function ({ app }: { app: express.Application }) {
  app.use(cors(corsOptionDelegate));
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(bodyParser.json());

  app.options('*', cors(corsOptionDelegate));
}

export { corsOptionDelegate };
