import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import jwtUserENV from '../../config/jwtUserENV.js';
import UserStories from '../../sequelize/models/stories/userstory.model.js';
import Follows from '../../sequelize/models/user/follow.model.js';
import User from '../../sequelize/models/user/user.model.js';

// ** Fetch stories of users that the current user is following ** //
export const getFollowingUserStories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res.status(400).json({ message: 'Invalid user token' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.status(400).json({ message: 'Invalid user token' });
          return;
        }
        const user_id = decodedToken.id;
        if (isNaN(user_id)) {
          res.status(400).json({ message: 'Invalid user ID' });
          return;
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(400).json({ message: 'User not found' });
          return;
        }

        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;

        const followedUser = await Follows.findAll({
          where: { follower_id: user_id },
          attributes: ['following_id'],
        });
        if (!followedUser || followedUser.length === 0) {
          res.status(200).json({
            message: 'No stories found',
            stories: [],
            limit,
            offset,
          });
          return;
        }

        const followedUserids = followedUser.map(
          (follow: any) => follow.following_id
        );

        const story = await UserStories.findAll({
          where: {
            user_id: {
              [Op.in]: followedUserids,
            },
          },
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'profilePic', 'avatarUrl'],
            },
          ],
          order: [['created_at', 'DESC']],
          limit: limit,
          offset: offset * limit,
        });

        if (story.length === 0) {
          res.status(200).json({
            message: 'No stories found',
            story: [],
            limit,
            offset,
          });
          return;
        }

        // ** Format the stories array to include user details ** //
        const storiesArray = story.map((story: any) => ({
          id: story.id,
          user_id: story.user_id,
          storyUrl: story.storyUrl,
          created_at: story.created_at,
          expires_at: story.expires_at,
          User: {
            id: story.User.id,
            username: story.User.username,
            profilePic: story.User.profilePic,
          },
        }));
        res.status(200).json({
          message: 'Stories found successfully',
          story: storiesArray || [],
          limit,
          offset,
        });
      }
    );
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Update UserStory when uploading a new story ** //
export const updateUserStory = async (req: Request, res: Response) => {
  try {
    const { storyUrl: newStoryUrl, ...rest } = req.body;
    console.log('Story URL:', newStoryUrl);

    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized! No token provided' });
    }

    try {
      jwt.verify(
        usertoken,
        jwtUserENV.JWT_USER_SECRET as string,
        async (err: any, decodedToken: any) => {
          if (err) {
            res
              .status(401)
              .json({ message: 'Unauthorized! Error verifying user token' });
            return;
          }

          const user_id = decodedToken.id;
          if (!user_id) {
            res.status(401).json({ message: 'Unauthorized! id not match' });
            return;
          }

          const user = await User.findByPk(user_id);
          if (!user) {
            res.status(401).json({ message: 'Unauthorized! No user found' });
            return;
          }

          let storyUrl = newStoryUrl;

          const story = await UserStories.findStoryByReferenceKey(
            'user_id',
            user_id
          );
          if (story) {
            await story.update({ storyUrl: newStoryUrl });
            return story;
          }
          if (!story) {
            res.status(404).json({ message: 'Story not found' });
          }

          const attributes = { ...rest, storyUrl };
          const [affectedCount, updatedStory] = await UserStories.updateStory(
            user_id,
            attributes
          );

          if (affectedCount === 0) {
            console.log('Error updating story:', updatedStory);
            return res.status(500).json({ message: 'Error updating story' });
          }

          res.status(200).json({
            message: 'Story uploaded successfully',
            storyUrl: newStoryUrl,
          });
          return story;
        }
      );
    } catch (error) {
      console.error('Error uploading story:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  return updateUserStory;
};

// ** Fetch stories of the current user ** //
export const getUserStories = async (req: Request, res: Response) => {
  try {
    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res.status(400).json({ message: 'Invalid user token' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.status(400).json({ message: 'Invalid user token' });
          return;
        }

        const user_ids = decodedToken.id;
        if (isNaN(user_ids)) {
          res.status(400).json({ message: 'Invalid user ID' });
          return;
        }

        const user_id = parseInt(req.query.user_id as string, 10) || 10;

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(400).json({ message: 'User not found' });
          return;
        }

        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;

        const story = await UserStories.findAll({
          where: { user_id: user_id },
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'profilePic', 'avatarUrl'],
            },
          ],
          limit,
          offset: offset * limit,
        });

        if (story.length === 0) {
          res.status(200).json({
            message: 'No stories found',
            story: [],
            limit,
            offset,
          });
          return;
        }

        res.status(200).json({
          message: 'Stories found successfully',
          story: story || [],
          limit,
          offset,
        });
      }
    );
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getFollowingUserStories,
  updateUserStory,
};
