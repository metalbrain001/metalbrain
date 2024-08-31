import express from 'express';
import postRoutes from './post/postRoutes.js';
import userStoryRoutes from './stories/userStoryRoutes.js';
import imageRoutes from './upload/imageRoutes.js';
import followRoutes from './user/followRoutes.js';
import userRoutes from './user/userRoutes.js';
import verifyUserRoutes from './user/verifyUserRoutes.js';

const router = express.Router();

router.use(verifyUserRoutes);

router.use(userRoutes);

router.use(followRoutes);

router.use(postRoutes);

router.use(imageRoutes);

router.use(userStoryRoutes);

export { router };
