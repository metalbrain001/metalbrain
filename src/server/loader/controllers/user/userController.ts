import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../../config/jwtUserENV.js';
import User from '../../sequelize/models/user/user.model.js';
import { errorHandler } from '../../services/errorHandler.js';
dotenv.config();

// ** Method to fetch all users with limit and offset ** //
export const allUsers = async (req: Request, res: Response) => {
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
        const user_id = decodedToken.id;
        if (!user_id) {
          res.status(400).json({ message: 'User id not found' });
          return;
        }

        const user = await User.findByPk(user_id, {
          attributes: ['id', 'username', 'profilePic', 'avatarUrl'],
        });

        if (user_id !== user?.id) {
          res
            .status(400)
            .json({ message: 'Unauthorized attempt: user id do not match' });
          return;
        }
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;

        const users = await User.findAll({
          attributes: ['id', 'username', 'profilePic', 'avatarUrl'],
          limit: limit,
          offset: offset,
        });

        if (users.length === 0) {
          res.status(404).json({ message: 'No users found' });
          return;
        }

        const userObject = users.reduce((acc: any, user: any) => {
          acc[user.id] = user;
          return acc;
        }, {});

        res.status(200).json({
          message: 'Users fetched successfully',
          users,
        });
      }
    );
  } catch (error: any) {
    console.error('Error in fetching all users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get user by ID Controller ** //
export const getUserById = async (req: Request, res: Response) => {
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

        if (id !== user?.id) {
          res
            .status(400)
            .json({ message: 'Unauthorized attempt: user id do not match' });
          return;
        }

        const user_id = parseInt(req.query.user_id as string, 10) || 10;
        const requestuser = await User.findByPk(user_id, {
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
        if (!requestuser) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        res.status(200).json({
          message: 'User found successfully',
          user: requestuser,
          id: id,
        });
      }
    );
  } catch (error: any) {
    errorHandler(error, res);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export default { allUsers, getUserById };
