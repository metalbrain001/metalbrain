import express from 'express';
import {
  getFollowingUserStories,
  getUserStories,
  updateUserStory,
} from '../../controllers/stories/UserStoryController.js';

const router = express.Router();

// ** Fetch stories a user is following ** //
router.get('/api/userstories', getFollowingUserStories);

// ** Update userStory ** //
router.put('/api/updateUserStory', updateUserStory);

// ** Fetch userStory ** //
router.get('/api/userstory/:id', getUserStories);

export default router;
