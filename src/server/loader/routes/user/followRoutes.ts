import express from 'express';
import {
  blockUser,
  followUser,
  getFollowers,
  getFollowersAndFollowing,
  getFollowersAndFollowingCount,
  getFollowing,
  getFollowingById,
  getFollowStatus,
  unfollowUser,
} from '../../controllers/user/followController.js';

const router = express.Router();

// ** The Unfollow Route ** //
router.post('/api/unfollowuser', unfollowUser);

// ** The Get Followers Route ** //
router.get('/api/getfollowers', getFollowers);

// ** The Get Following Route ** //
router.get('/api/getfollowing', getFollowing);

// ** The Follow User Route ** //
router.post('/api/followuser', followUser);

// ** The Get Following and Followers Route ** //
router.get('/api/getfollowingfollowers/:user_id', getFollowersAndFollowing);

// ** The Block User Route ** //
router.post('/api/blockuser', blockUser);

// ** The Get count of followers and following Route ** //
router.get(
  '/api/getfollowersfollowingcount/:user_id',
  getFollowersAndFollowingCount
);

// ** The Get follow status Route ** //
router.get('/api/getfollowstatus', getFollowStatus);

// ** The get user a user is following by id to fetch their stories ** //
router.get('/api/getfollowingbyid/:user_id', getFollowingById);

export default router;
