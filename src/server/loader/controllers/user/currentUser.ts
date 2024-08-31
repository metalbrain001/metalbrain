import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../../config/jwtUserENV.js';
import User from '../../sequelize/models/user/user.model.js';

// ** Current User Controller ** //
export const currentUser = async (req: Request, res: Response) => {
  try {
    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res.status(400).json({ message: 'No User Token found' });
      return;
    }
    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          console.log('Error in verifying token', err);
          res.status(400).json({ message: 'Invalid User Token' });
          return;
        }
        const id = decodedToken.id;
        if (!id) {
          res.status(400).json({ message: 'User id not found' });
          return;
        }

        const user = await User.findByPk(id, {
          attributes: ['id', 'username'],
        });

        if (id !== user?.id) {
          res
            .status(400)
            .json({ message: 'Unauthorized attempt: user id do not match' });
          return;
        }

        res.status(200).json({
          message: 'User found successfully',
          user,
          id,
        });
      }
    );
  } catch (error: any) {
    console.error('Error in current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
