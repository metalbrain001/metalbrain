import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { validateMIMEType } from 'validate-image-type';
import { imgenv } from '../config/imgENV';
import jwtUserENV from '../config/jwtUserENV';
import Image_storages from '../sequelize/models/image/image.model';

const uploadDIR = imgenv.UPLOAD_IMAGE_DIR;

if (!fs.existsSync(uploadDIR)) {
  fs.mkdirSync(uploadDIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const validationResult = async (file: any, cb: any) => {
  try {
    const validationResult = await validateMIMEType(file.path, {
      originalFilename: file.originalname,
      allowMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    });
    if (!validationResult) {
      return cb(new Error('Invalid file type'), 400);
    }
    cb(null, true);
  } catch (error) {
    console.log('Error in file validation', error);
    cb(error, 400);
  }
};

// ** Define upload middleware  ** //
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (_req, file, cb) {
    const fileTypes = /jpeg|jpg|png|svg/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    validationResult(file, cb);
  },
});

const imageUploadMiddleware = async (
  req: Request & { file?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file) {
      console.log('File uploaded successfully', req.file);
      const imageUrl = path.join(imgenv.UPLOAD_IMAGE_DIR, req.file.filename);
      const token = req.cookies.userJwt;
      if (!token) {
        return res.status(401).send('Unauthorized');
      }

      jwt.verify(
        token,
        jwtUserENV.JWT_USER_SECRET as string,
        async (err: any, decodedToken: any) => {
          if (err) {
            return res.status(401).send('Unauthorized');
          }

          const user_id = decodedToken.id;
          if (!user_id) {
            return res.status(401).send('Unauthorized');
          }

          const imageRecord = await Image_storages.create({
            creator_id: user_id,
            imageUrl: imageUrl,
            post_id: req.body.post_id,
            created_at: new Date(),
          });

          if (!imageRecord) {
            return res.status(400).send('Error in image upload');
          }

          req.body.image_id = imageRecord.id;

          res.status(201).send({ imageUrl: imageUrl });
          next();
        }
      );
    }
  } catch (error) {
    console.log('Error in file upload', error);
    res.status(400).send('Error in file upload');
  }
};

export default {
  upload,
  imageUploadMiddleware,
};
