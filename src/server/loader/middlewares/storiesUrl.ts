import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { validateMIMEType } from 'validate-image-type';
import { imgenv } from '../config/imgENV.js';
import jwtUserENV from '../config/jwtUserENV.js';
import UserStories from '../sequelize/models/stories/userstory.model.js';
import User from '../sequelize/models/user/user.model.js';

// ** Define custom destination directory for stories
const uploadStoryDir = imgenv.UPLOAD_STORIES_URL;

// ** Define storage
const storyStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadStoryDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// ** Check file type
const validateMimeType = async (file: any, cb: any) => {
  try {
    const validationResult = await validateMIMEType(file.path, {
      originalFilename: file.originalname,
      allowMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'video/mp4',
        'video/webm',
      ],
    });

    if (!validationResult.ok) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  } catch (error) {
    console.error('Error validating file type:', error);
    cb(new Error('Error validating file type'));
  }
};

// ** Define upload
const uploadStory = multer({
  storage: storyStorage,
  limits: { fileSize: 20000000 }, // Allowing larger file size for stories
  fileFilter: function (_req, file, cb) {
    const filetypes = /jpeg|jpg|png|svg|mp4|webm/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    validateMimeType(file.path, cb);
  },
});

// ** Upload middleware
const uploadMiddleware = async (req: Request, res: Response, next: any) => {
  try {
    if (req.file) {
      console.log('File uploaded:', req.file);
      const storyPath = req.file.path;
      console.log('story Path:', storyPath);
      const storyUrl = path.join('assets/stories', req.file.filename);
      console.log('Story URL:', storyUrl);

      const usertoken = req.cookies.userjwt;
      if (!usertoken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      jwt.verify(
        usertoken,
        jwtUserENV.JWT_USER_SECRET as string,
        async (err: any, decodedToken: any) => {
          if (err) {
            console.log(err.message);
            return res.status(401).json({ message: 'Unauthorized' });
          }

          const user_id = decodedToken.id;

          const user = await User.findByPk(user_id);

          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          try {
            const storyRecord = await UserStories.create({
              user_id: user_id,
              storyUrl: storyUrl,
              created_at: new Date(),
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            });

            if (!storyRecord) {
              res.status(500).send({ error: 'Error creating story record' });
              return;
            }

            req.body.storyUrl = storyRecord.user_id;

            console.log('story ID:', storyRecord.user_id);

            res.status(201).send({
              message: 'Story uploaded successfully',
              storyUrl: storyUrl,
            });

            console.log('story record created:', storyRecord);
          } catch (error) {
            console.error('Error retrieving user:', error);
            return res.status(500).json({ message: 'Error retrieving user' });
          }
          return next();
        }
      );
    } else {
      res.status(400).send({ error: 'No File Uploaded!' });
    }
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).send({ error: 'Error uploading story from server 500' });
  }
  return next();
};

export { uploadMiddleware, uploadStory };
