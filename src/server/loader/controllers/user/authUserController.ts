import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../../config/jwtUserENV.js';
import User from '../../sequelize/models/user/user.model.js';
import UserRegistration from '../../sequelize/models/user/userregistrations.model.js';
import { errorHandler } from '../../services/errorHandler.js'; // Import the errorHandler function correctly
import {
  generateUserJWT,
  generateUserRefreshToken,
  verifyUserJWT,
} from './jwtUserGenerator.js';

dotenv.config();

// ** User Registration Controller ** //
// ** The User Registration Controller is a controller function that registers a new user. ** //

// ** The User Registration Controller function ** //
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ** Extract the user data from the request body ** //
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    // ** Check if the user already exists
    try {
      const userExists = await User.findOne({ where: { email: email } });
      if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }
    } catch (error: any) {
      errorHandler(error, res); // Call the errorHandler function correctly
    }
    // ** Create a new user ** //
    try {
      const user = await UserRegistration.create({
        new_user: name,
        username: username,
        email: email,
        password: password,
        created_at: new Date(),
      });

      // ** Generate a JWT for the user ** //
      try {
        const usertoken = generateUserJWT({ id: user.id });
        res.cookie('userjwt', usertoken, {
          httpOnly: jwtUserENV.JWT_HTTP_ONLY,
          maxAge: jwtUserENV.JWT_USER_MAX_AGE * 1000,
          secure: jwtUserENV.JWT_COOKIE_SECURE,
          sameSite: 'strict',
          expires: new Date(Date.now() + jwtUserENV.JWT_COOKIE_EXPIRES_IN),
        });
        res.status(201).json({
          message: 'User created  successfully',
          id: user.id,
          name: name,
          username: username,
          email: email,
          user: user,
          usertoken,
        });
      } catch (error: any) {
        errorHandler(error, res); // Call the errorHandler function correctly
      }
    } catch (error: any) {
      errorHandler(error, res); // Call the errorHandler function correctly
    }
  } catch (error: any) {
    errorHandler(error, res); // Call the errorHandler function correctly
  }
};

// ** User Login Controller ** //
// ** The User Login Controller is a controller function that logs in a user. ** //
// ** The User Login Controller function ** //
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // ** Extract the user data from the request body ** //
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    // ** Check if the user exists ** //
    try {
      const userExists = await User.findOne({ where: { email: email } });
      if (!userExists) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }
    } catch (error: any) {
      errorHandler(error, res); // Call the errorHandler function correctly
    }

    // ** Generate a JWT for the user ** //
    try {
      const user = await UserRegistration.loginUser(email, password);
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      } else {
        const usertoken = generateUserJWT({ id: user.id });
        res.cookie('userjwt', usertoken, {
          httpOnly: jwtUserENV.JWT_HTTP_ONLY,
          maxAge: jwtUserENV.JWT_USER_MAX_AGE * 1000,
          secure: jwtUserENV.JWT_COOKIE_SECURE,
          sameSite: 'strict',
          expires: new Date(Date.now() + jwtUserENV.JWT_COOKIE_EXPIRES_IN),
        });

        const userrefreshtoken = generateUserRefreshToken({ id: user.id });
        res.cookie('userrefreshjwt', userrefreshtoken, {
          httpOnly: jwtUserENV.JWT_COOKIE_HTTP_ONLY,
          maxAge: jwtUserENV.JWT_REFRESH_USER_MAX_AGES * 1000,
          secure: jwtUserENV.JWT_COOKIE_SECURE,
          sameSite: 'strict',
          expires: new Date(Date.now() + jwtUserENV.JWT_COOKIE_EXPIRES_IN),
        });
        res.setHeader('Authorization', `Bearer ${usertoken}`);
        res.status(200).json({
          message: 'User logged in successfully',
          user,
          usertoken,
          userrefreshtoken,
        });
      }
    } catch (error: any) {
      errorHandler(error, res); // Call the errorHandler function correctly
    }
  } catch (error: any) {
    errorHandler(error, res); // Call the errorHandler function correctly
  }
};

// ** User Token Refresh Controller ** //
export const userTokenRefresh = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userrefreshtoken = req.cookies.userrefreshtoken;
    if (!userrefreshtoken) {
      res.status(400).json({ message: 'No refresh token found' });
      return;
    }

    let user: any;

    try {
      user = verifyUserJWT(userrefreshtoken);
      if (user) {
        const userrefreshtoken = generateUserRefreshToken({ id: user.id });
        res.cookie('userrefreshtoken', userrefreshtoken, {
          httpOnly: jwtUserENV.JWT_COOKIE_HTTP_ONLY as boolean,
          maxAge: jwtUserENV.JWT_USER_MAX_AGE * 1000,
          secure: jwtUserENV.JWT_COOKIE_SECURE,
          sameSite: 'strict',
          expires: new Date(
            (Date.now() + jwtUserENV.JWT_REFRESH_USER_EXPIRES_IN) as string
          ),
        });

        res.status(200).json({
          message: 'Token refreshed successfully',
          refreshTokens: {
            userrefreshtoken: userrefreshtoken,
          },
        });
      } else {
        res.status(400).json({ message: 'Cannot refresh Invalid Token!' });
      }
    } catch (error) {
      console.log('Error verifying user token', error);
      res.status(400).json({ message: 'Invalid User Token' });
      return;
    }

    return;
  } catch (error) {
    console.log('Error refreshing user token', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** User Logout Controller ** //
export const logoutOutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usertoken = req.cookies.userjwt;
    const userrefreshtoken = req.cookies.userrefreshjwt;
    if (!usertoken || !userrefreshtoken) {
      res.status(400).json({ message: 'No token found' });
      return;
    }
    res.clearCookie('userjwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1,
    });
    res.clearCookie('userrefreshjwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1,
    });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error: any) {
    errorHandler(error, res);
    res.status(500).json({ message: 'Internal server error' });
  }
};
