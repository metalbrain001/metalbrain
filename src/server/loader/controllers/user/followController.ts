import { Request, Response } from 'express';
import UserStories from '../../sequelize/models/stories/userstory.model.js';
import Follows from '../../sequelize/models/user/follow.model.js';

// ** Follow a user ** //
export const followUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const follower_id = parseInt(req.body.follower_id as string, 10);
    const following_id = parseInt(req.body.following_id as string, 10);
    const status = req.body.status as string;

    if (isNaN(follower_id) || isNaN(following_id)) {
      res.status(400).json({ message: 'Invalid follower or following ID' });
      return;
    }

    const [followRecord, created] = await Follows.findOrCreate({
      where: { follower_id, following_id },
      defaults: {
        follower_id,
        following_id,
        status: status === 'follow' ? 'follow' : 'unfollow',
      },
    });

    if (!created && status !== 'follow') {
      if (status === 'unfollow' || status === 'block') {
        await followRecord.destroy();
        res.status(200).json({
          message: `User ${status}ed successfully`,
          status: status,
        });
      }
    } else if (status === 'follow') {
      followRecord.status = 'follow';
      await followRecord.save();
    }

    if (status === 'follow') {
      res.status(200).json({
        message: 'User followed successfully',
        follower_id: followRecord.follower_id,
        following_id: followRecord.following_id,
        status: followRecord.status,
      });
    }
  } catch (error: any) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Unfollow a user ** //
export const unfollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const follower_id = parseInt(req.body.follower_id as string, 10);
    const following_id = parseInt(req.body.following_id as string, 10);

    if (isNaN(follower_id) || isNaN(following_id)) {
      res.status(400).json({ message: 'Invalid follower or following ID' });
      return;
    }

    const followRecord = await Follows.findOne({
      where: { follower_id, following_id },
    });

    if (!followRecord) {
      res.status(404).json({ message: 'Follow relationship not found' });
      return;
    }

    await followRecord.destroy();
    res.status(200).json({
      message: 'User unfollowed successfully',
      follower_id,
      following_id,
    });
  } catch (error: any) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get all followers of a user ** //
export const getFollowers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.query.user_id as string, 10) || 10;

    if (isNaN(user_id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const followers = await Follows.findAll({
      where: { following_id: user_id, status: 'follow' },
    });
    res.status(200).json(followers || []);
  } catch (error: any) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get all users a user is following ** //
export const getFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.query.user_id as string, 10) || 10;

    if (isNaN(user_id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const following = await Follows.findAll({
      where: { follower_id: user_id },
    });
    res.status(200).json(following || []);
  } catch (error: any) {
    console.error('Error getting following:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** GEt follow status of a user ** //
export const getFollowStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const follower_id = parseInt(req.query.follower_id as string, 10);
    const following_id = parseInt(req.query.following_id as string, 10);
    const status = req.query.status as string;

    if (isNaN(follower_id) || isNaN(following_id)) {
      res.status(400).json({ message: 'Invalid follower or following ID' });
      return;
    }

    // If the user is viewing their own profile, no need to check the follow relationship
    if (follower_id === following_id) {
      res.status(200).json({
        message: 'User is viewing their own profile',
        status: 'self profile', // Custom status to indicate self-profile view
      });
      return;
    }

    const followRecord = await Follows.findOne({
      where: { follower_id: follower_id, following_id: following_id },
    });

    if (!followRecord) {
      res.status(200).json({
        message: 'Not following',
        status: 'not_following',
      });
      return;
    }

    res.status(200).json({
      message: 'Follow status fetched successfully',
      status: status,
    });
  } catch (error: any) {
    console.error('Error getting follow status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get Following and Followers of a user ** //
export const getFollowersAndFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.params.user_id, 10);

    if (isNaN(user_id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const followers = await Follows.findAll({
      where: { following_id: user_id },
    });
    const following = await Follows.findAll({
      where: { follower_id: user_id },
    });
    res.status(200).json({ followers, following });
  } catch (error: any) {
    console.error('Error getting followers and following:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get Count of Followers and Following of a user ** //
export const getFollowersAndFollowingCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.params.user_id, 10);

    if (isNaN(user_id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const followers = await Follows.count({
      where: { following_id: user_id },
    });
    const following = await Follows.count({
      where: { follower_id: user_id },
    });
    res.status(200).json({ followers, following });
  } catch (error: any) {
    console.error('Error getting followers and following count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Block a user ** //
export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const follower_id = parseInt(req.body.follower_id as string, 10);
    const following_id = parseInt(req.body.following_id as string, 10);

    if (isNaN(follower_id) || isNaN(following_id)) {
      res.status(400).json({ message: 'Invalid follower or following ID' });
      return;
    }

    const followRecord = await Follows.findOne({
      where: { follower_id, following_id },
    });

    if (!followRecord) {
      res.status(404).json({ message: 'Follow relationship not found' });
      return;
    }

    followRecord.status = 'block';
    await followRecord.save();
    res.status(200).json({
      message: 'User blocked successfully',
      follower_id,
      following_id,
    });
  } catch (error: any) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get the user a user is following by id to fetch the user's stories ** //
export const getFollowingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.params.user_id, 10);
    if (isNaN(user_id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const following = await Follows.findAll({
      where: { follower_id: user_id },
      attributes: ['following_id'],
    });
    if (!following || following.length === 0) {
      res.status(200).json({ message: 'No following user found' });
      return;
    }

    const followingIds = following.map(follow => follow.following_id);
    const story = await UserStories.findAll({
      where: { user_id: followingIds },
    });
    if (!story || story.length === 0) {
      res.status(200).json({
        message: 'No stories found',
        story: [],
      });
      return;
    }
  } catch (error: any) {
    console.error('Error getting following user stories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  unfollowUser,
  getFollowers,
  getFollowersAndFollowing,
  getFollowersAndFollowingCount,
  followUser,
  getFollowing,
  blockUser,
  getFollowStatus,
  getFollowingById,
};
