import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../../config/jwtUserENV.js';
import { verifyUser } from '../../middlewares/verifyUser.js';
import User from '../../sequelize/models/user/user.model.js';

const router = Router();

router.get(
  '/api/verifyUser',
  verifyUser,
  async (req: Request, res: Response) => {
    try {
      const usertoken = req.cookies.userjwt;
      if (!usertoken) {
        console.log('No token found: fail to authenticate user');
        return res.status(401).json({ message: 'User not authenticated' });
      }
      jwt.verify(
        usertoken,
        jwtUserENV.JWT_USER_SECRET as string,
        async (err: Error | any, decodedToken: any) => {
          if (err) {
            console.error('Error verifying user:', err.message);
            return res.status(401).json({ message: 'User not authenticated' });
          }
          const id = decodedToken.id;
          const user = await User.findByPk(id, {
            attributes: [
              'id',
              'firstName',
              'lastName',
              'bio',
              'created_at',
              'username',
              'last_activity',
              'followers',
              'following',
              'role',
              'avatarUrl',
              'profilePic',
            ],
          });
          if (!user) {
            console.error('User not found:', decodedToken.id);
            return res.status(404).json({ message: 'User not found' });
          }
          return res.status(200).json({
            message: 'User authenticated',
            id: decodedToken.id,
            user: user,
          });
        }
      );
    } catch (error) {
      console.error('Error verifying user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
