import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../config/jwtUserENV.js';
import User from '../sequelize/models/user/user.model.js';

dotenv.config();

// ** Verify User Middleware ** //
// ** The Verify User Middleware is a middleware function that verifies a user's JWT. ** //

// ** The Verify User Middleware function ** //
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // ** Verify the token ** //
  try {
    const usertoken = req.cookies.userjwt;
    if (usertoken) {
      jwt.verify(
        usertoken,
        jwtUserENV.JWT_USER_SECRET as string,
        async (err: any, decodedToken: any) => {
          if (err) {
            console.log('Error in verifying token', err);
            res.locals.user = null;
          } else {
            try {
              const id = decodedToken.id;
              const user = await User.findByPk(id, {
                attributes: [
                  'id',
                  'firstName',
                  'lastName',
                  'bio',
                  'avatarUrl',
                  'profilePic',
                  'username',
                ],
              });
              console.log('decodedToken:', decodedToken); // ** Debugging ** //
              if (user) {
                res.locals.user = user;
              } else {
                res.locals.user = null;
              }
            } catch (error) {
              console.log('Error in finding user', error);
              res.locals.user = null;
            }
          }
          next();
        }
      );
    } else {
      res.locals.user = null;
      next();
    }
  } catch (error) {
    console.log('Error in verifying token', error);
    res.locals.user = null;
    next();
  }
};
