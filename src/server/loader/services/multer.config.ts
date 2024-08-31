import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { validateMIMEType } from 'validate-image-type';
import { imgenv } from '../config/imgENV.js';

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

export default upload;
