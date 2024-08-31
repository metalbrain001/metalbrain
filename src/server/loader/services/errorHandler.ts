import { NextFunction, Response } from 'express';
import fs from 'fs';
import { env } from '../config/expressENV.js';

function logErrorTofile(err: Error) {
  const log = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
  fs.appendFile('error.log', log + '\n', error => {
    if (error) {
      console.error(error);
    }
  });
}

export const errorHandler = (
  err: Error & { code: number; error?: [] },
  res: Response
): void => {
  if (env.NODE_ENV === 'development') {
    console.error(err);
    res.status(500).json({ error: err.message });
  } else if (env.NODE_ENV === 'production') {
    fs.appendFile('error.log', err.message + '\n', error => {
      if (error) {
        console.error(error);
      }
    });
    res.status(500).json({ error: 'Something went wrong' });
  }
  let errors: { [key: string]: string } = {};
  if (err.message.includes('new user validation failed')) {
    errors = {
      name: 'new user validation failed',
      username: err.message.includes('username is required')
        ? 'username must be at least 3 characters long'
        : 'username already in use',
      email: err.message.includes('email is required')
        ? 'email is required'
        : 'email already in use',
      password: err.message.includes('password is required')
        ? 'password is required'
        : 'password must be at least 6 characters long',
    };
  }

  if (err.message.includes('new admin validation failed')) {
    errors = {
      name: 'new admin validation failed',
      username: err.message.includes('username is required')
        ? 'username must be at least 3 characters long'
        : 'username already in use',
      email: err.message.includes('email is required')
        ? 'email is required'
        : 'email already in use',
      password: err.message.includes('password is required')
        ? 'password is required'
        : 'password must be at least 6 characters long',
    };
  }

  if (err.message.includes('User already exists')) {
    errors = {
      name: 'User already exists',
      username: 'username already in use',
      email: 'email already in use',
    };
  }

  if (err.message.includes('Admin already exists')) {
    errors = {
      name: 'Admin already exists',
      username: 'username already in use',
      email: 'email already in use',
    };
  }

  if (err.message.includes('UserRegistration.email')) {
    errors = {
      name: 'UserRegistration already exists',
      username: 'username already in use',
      email: 'email already in use',
    };
  }

  if (err.message.includes('AdminRegistration.email')) {
    errors = {
      name: 'AdminRegistration already exists',
      username: 'username already in use',
      email: 'email already in use',
    };
  }

  if (err.message.includes('User not found')) {
    errors = {
      name: 'User not found',
      username: 'username not found',
      email: 'email not found',
    };
  }

  if (err.message.includes('Admin not found')) {
    errors = {
      name: 'Admin not found',
      username: 'username not found',
      email: 'email not found',
    };
  }

  if (err.message.includes('incorrect password')) {
    errors = {
      name: 'incorrect password',
      password: 'password is incorrect',
    };
  }

  if (err.message.includes('incorrect email')) {
    errors = {
      name: 'incorrect email',
      email: 'email is incorrect',
    };
  }

  if (err.message.includes('jwt malformed')) {
    errors = {
      name: 'jwt malformed',
      token: 'jwt malformed',
    };
  }

  if (err.message.includes('jwt expired')) {
    errors = {
      name: 'jwt expired',
      token: 'jwt expired',
    };
  }

  if (err.name === 'SequlizeValidationError' && err.error) {
    errors = err.error.reduce(
      (
        acc: { [key: string]: string },
        error: { path: string; message: string }
      ) => {
        acc[error.path] = error.message;
        return acc;
      },
      {}
    );
  }

  res.status(err.code || 500).json({ errors });
};

const unhandledRejection = new Map();
process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
  logErrorTofile(
    new Error(`Unhandled Rejection at: ${promise} reason: ${reason}`)
  );
  unhandledRejection.set(promise, reason);
  return process.exit(1);
});

process.on('rejectionHandled', promise => {
  unhandledRejection.delete(promise);
});

export async function globalErrorHandler(res: Response, next: NextFunction) {
  logErrorTofile(new Error('Global Error Handler'));
  res.status(500).json({ error: 'Something went wrong global error' });
  next();

  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
    logErrorTofile(
      new Error(`Unhandled Rejection at: ${promise} reason: ${reason}`)
    );
    process.exit(1);
  });

  process.on('uncaughtException', err => {
    console.error(`Uncaught Exception thrown: ${err}`);
    logErrorTofile(new Error(`Uncaught Exception thrown: ${err}`));
    process.exit(1);
  });

  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exception:', err, 'Origin:', origin);
    process.exit(1);
  });

  process.on('uncaughtException', err => {
    fs.writeSync(process.stderr.fd, `Caught exception: ${err}\n`);
    console.error(`Uncaught Exception thrown: ${err}`);
    logErrorTofile(new Error(`Uncaught Exception thrown: ${err}`));
    process.exit(1);
  });
}

export default {
  globalErrorHandler,
  errorHandler,
  logErrorTofile,
};
