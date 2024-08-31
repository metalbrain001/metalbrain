import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtAdminENV from '../config/jwtAdminENV.js';
import Admin from '../sequelize/models/admin/admin.model.js';
import { IRole } from '../types';

// ** Verify Admin Middleware ** //
// ** The Verify Admin Middleware is a middleware function that verifies an admin's JWT. ** //

// ** The Verify Admin Middleware function ** //
export const isAdmin = (requiredRole: IRole) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // ** Verify the token ** //
    try {
      const token = req.cookies.adminJwt;
      if (token) {
        jwt.verify(
          token,
          jwtAdminENV.JWT_ADMIN_SECRET,
          async (err: any, decodedToken: any) => {
            if (err) {
              console.log('Error in verifying token', err);
              res.locals.admin = null;
            } else {
              try {
                const admin = await Admin.findOne({
                  where: { id: decodedToken.id },
                });
                if (admin) {
                  if (admin.role === requiredRole) {
                    res.locals.admin = admin;
                  } else {
                    return res.status(403).json({
                      message: 'Access denied. Insufficient permissions.',
                    });
                  }
                } else {
                  return res.status(404).json({ message: 'No Admin found.' });
                }
              } catch (error) {
                console.log('Error in finding admin', error);
                res.locals.admin = null;
              }
            }
          }
        );
      } else {
        res.status(401).json({ message: 'Access denied, no token provided.' });
        next();
      }
    } catch (error) {
      console.log('Error in verifying token', error);
      res.locals.admin = null;
      next();
    }
  };
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.locals.admin) {
    next();
  } else {
    return res.status(401).json({
      message: 'Access Denied: You are not authorized to access this resource',
    });
  }
};

export default {
  isAdmin,
  authorizeAdmin,
};
