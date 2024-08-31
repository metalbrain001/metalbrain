import express from 'express';
import {
  createPost,
  deleteLikedPost,
  deletePost,
  getAllPosts,
  getInfinitePosts,
  getRecentPosts,
  likePost,
  savePost,
  updatePost,
} from '../../controllers/post/postController.js';

const router = express.Router();

// ** GET /api/getInfinitePosts - Get infinite posts for pagination ** //
router.get('/api/getInfinitePosts', getInfinitePosts);

// Create a new post
router.post('/api/createPost', createPost);

// Update a post
router.put('/api/updatePost', updatePost);

// ** Get all posts ** //
router.get('/api/getAllPosts', getAllPosts);

// ** Get recent posts ** //
router.get('/api/getRecentPosts', getRecentPosts);

// ** Save a post ** //
router.post('/api/savePost', savePost);

// ** Like a post ** //
router.post('/api/likePost', likePost);

// ** Delete a post ** //
router.delete('/api/deletePost', deletePost);

// ** Delete LikedPost ** //
router.delete('/api/deleteLikedPost', deleteLikedPost);

export default router;
