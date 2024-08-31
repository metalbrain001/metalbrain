import 'dotenv/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../../config/jwtUserENV.js';
import Image_storages from '../../sequelize/models/image/image.model.js';
import UsersStories from '../../sequelize/models/stories/userstory.model.js';
import Profile_pictures from '../../sequelize/models/user/profilepic.model.js';
import User from '../../sequelize/models/user/user.model.js';

// ** Refactored function to return image URL
export const getImagePreviewUrl = async (
  req: Request,
  res: Response
): Promise<void | null> => {
  try {
    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const user_id = decodedToken.id;
        if (!user_id) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const image = await Image_storages.findImageByReferenceKey(
          'user_id',
          user_id
        );
        if (!image) {
          res.status(200).json({ message: 'No image found' });
        } else {
          res.status(200).json({ imageUrl: image.imageUrl });
        }
      }
    );
  } catch (error) {
    console.error('Error getting image preview:', error);
    throw new Error('Failed to get image preview');
  }
};

// ** Return Profile picture url for preview
export const getProfilePicPreviewUrl = async (
  req: Request
): Promise<void | null> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error('Unauthorized');
    }

    jwt.verify(
      token,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          throw new Error('Unauthorized');
        }

        const user_id = decodedToken.id;
        if (!user_id) {
          throw new Error('Unauthorized');
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          console.log('No user found');
          throw new Error('Unauthorized');
        }

        const profilePic = await Profile_pictures.findProfilePicByReferenceKey(
          'user_id',
          user_id
        );
        if (!profilePic) {
          console.log('No profile pic found');
          return null;
        }
        console.log('Profile Pic:', profilePic);
        return profilePic;
      }
    );
  } catch (error) {
    console.error('Error getting profile pic preview:', error);
    throw new Error('Failed to get profile pic preview');
  }
};

// ** Return user story image url for preview ** //
export const getUserStoryImageUrl = async (
  req: Request,
  res: Response
): Promise<void | null> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    jwt.verify(
      token,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const user_id = decodedToken.id;
        if (!user_id) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const story = await UsersStories.findStoryByReferenceKey(
          'user_id',
          user_id
        );
        if (!story) {
          res.status(200).json({ message: 'No story found' });
        } else {
          res.status(200).json({ storyUrl: story.storyUrl });
        }
      }
    );
  } catch (error) {
    console.error('Error getting user story:', error);
    throw new Error('Failed to get user story');
  }
};

export default {
  getImagePreviewUrl,
  getProfilePicPreviewUrl,
  getUserStoryImageUrl,
};
