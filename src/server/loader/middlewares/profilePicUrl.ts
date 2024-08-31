import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { validateMIMEType } from 'validate-image-type';
import { imgenv } from '../config/imgENV.js';
import jwtUserENV from '../config/jwtUserENV.js';
import Profile_pictures from '../sequelize/models/user/profilepic.model.js';
import User from '../sequelize/models/user/user.model.js';

// ** Define custom destination directory for stories
const uploadProfilePicDir = imgenv.UPLOAD_PROFILE_PIC_URL;

// ** Define storage
const profilePicStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadProfilePicDir);
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
const uploadprofilePic = multer({
  storage: profilePicStorage,
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
      const profilePicPath = req.file.path;
      console.log('story Path:', profilePicPath);
      const profilePicUrl = path.join('assets/profilePic', req.file.filename);
      console.log('profile Picture URL:', profilePicUrl);

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
            const profilePicRecord = await Profile_pictures.create({
              user_id: user_id,
              profilePic: profilePicUrl,
              created_at: new Date(),
              updated_at: new Date(),
            });

            if (!profilePicRecord) {
              res.status(500).send({ error: 'Error creating story record' });
              return;
            }

            await user.update({ profilePic: profilePicUrl });

            req.body.storyUrl = profilePicRecord.user_id;

            console.log('profile Pic ID:', profilePicRecord.user_id);

            res.status(201).send({
              message: 'Story uploaded successfully',
              profilePic: profilePicRecord.profilePic,
            });

            console.log('profile picture record created:', profilePicRecord);
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

export { uploadMiddleware, uploadprofilePic };
