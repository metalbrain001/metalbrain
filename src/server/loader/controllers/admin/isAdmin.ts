import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtAdminENV from '../../config/jwtAdminENV.js';
import Admin from '../../sequelize/models/admin/admin.model.js';

// ** Persist Admin as current user ** //
// ** The Persist Admin function persists the current admin as the user ** //

// ** The Persist Admin function ** //
export const persistAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
                  res.locals.admin = admin;
                } else {
                  res.locals.admin = null;
                }
              } catch (error) {
                console.log('Error in finding admin', error);
                res.locals.admin = null;
              }
            }
            next();
          }
        );
      } else {
        res.locals.admin = null;
        next();
      }
    } catch (error) {
      console.log('Error in verifying token', error);
      res.locals.admin = null;
      next();
    }
  } catch (error) {
    console.log('Error in persisting admin', error);
    res.locals.admin = null;
    next();
  }
  next();
};
