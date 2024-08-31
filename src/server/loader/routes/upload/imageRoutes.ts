import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

import jwtUserENV from '../../config/jwtUserENV.js';
import {
  getImagePreviewUrl,
  getProfilePicPreviewUrl,
  getUserStoryImageUrl,
} from '../../controllers/upload/imageController.js';
import { uploadStory } from '../../middlewares/storiesUrl.js';
import Image_storages from '../../sequelize/models/image/image.model.js';
import UserStories from '../../sequelize/models/stories/userstory.model.js';
import Profile_pictures from '../../sequelize/models/user/profilepic.model.js';
import User from '../../sequelize/models/user/user.model.js';
import upload from '../../services/multer.config.js';

dotenv.config();

const router = express.Router();

// ** Upload Post Image Route ** //
router.post('/api/uploadImage', upload.single('image'), async (req, res) => {
  try {
    console.log('File uploaded:', req.file);
    // Modify the file path to the required format
    const relativePath = `assets/images/${req.file?.filename}`;

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

        const imageRecord = await Image_storages.create({
          imageUrl: relativePath,
          post_id: req.body.post_id,
          creator_id: user.id,
          created_at: new Date(),
        });

        if (!imageRecord) {
          res.status(500).send({ error: 'Error creating image record' });
          return;
        }
        res.status(200).json({
          message: 'Image uploaded successfully',
          imageUrl: relativePath,
        });
      }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ** Return picture url for preview
router.get('/api/sendImageUrl', getImagePreviewUrl);

// ** Upload Profile Picture Route ** //
router.post(
  '/api/uploadProfilePic',
  upload.single('file'),
  async (req, res) => {
    try {
      console.log('File uploaded:', req.file);
      // Modify the file path to the required format
      const relativePath = `assets/images/${req.file?.filename}`;

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

          const profilePicRecord = await Profile_pictures.create({
            profilePic: relativePath,
            user_id: user_id || null,
            created_at: new Date(),
            updated_at: new Date(),
          });

          if (!profilePicRecord) {
            res.status(500).send({ error: 'Error creating image record' });
            return;
          }

          await user.update({ profilePic: relativePath });
          res.status(200).json({
            message: 'Image uploaded successfully',
            profilePic: relativePath,
          });
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// ** Return Profile picture url for preview
router.get('/api/sendProfilePicUrl', getProfilePicPreviewUrl);

// ** Upload Story Image Route ** //
router.post(
  '/api/uploadStory',
  uploadStory.single('file'),
  async (req, res) => {
    try {
      console.log('File uploaded:', req.file);
      // Modify the file path to the required format
      const relativePath = `assets/stories/${req.file?.filename}`;

      const usertoken = req.cookies.userjwt;

      if (!usertoken) {
        res.status(401).json({ message: 'Unauthorized! No token provided' });
        return;
      }
      jwt.verify(
        usertoken,
        jwtUserENV.JWT_USER_SECRET as string,
        async (err: any, decodedToken: any) => {
          if (err) {
            res
              .status(401)
              .json({ message: 'Unauthorized! Error Verifying user' });
            return;
          }
          const user_id = decodedToken.id;
          if (!user_id) {
            res
              .status(401)
              .json({ message: 'Unauthorized! Erro: user id not match' });
            return;
          }
          const user = await User.findByPk(user_id);
          if (!user) {
            res
              .status(401)
              .json({ message: 'Unauthorized! Error: No user found' });
            return;
          }

          const storyRecord = await UserStories.create({
            storyUrl: relativePath,
            user_id: user_id || null,
            created_at: new Date(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          });

          if (!storyRecord) {
            res.status(500).send({ error: 'Error creating image record' });
            return;
          }
          res.status(200).json({
            message: 'Image uploaded successfully In Route',
            storyUrl: relativePath,
          });
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// ** Return story url for preview ** //
router.get('/api/sendStoryurl', getUserStoryImageUrl);

export default router;
