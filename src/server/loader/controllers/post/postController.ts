import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtUserENV from '../../config/jwtUserENV.js';
import Image_storages from '../../sequelize/models/image/image.model.js';
import Likes from '../../sequelize/models/post/likes.model.js';
import Post from '../../sequelize/models/post/post.model.js';
import Saved_posts from '../../sequelize/models/post/savedpost.model.js';
import User from '../../sequelize/models/user/user.model.js';
import { getImagePreviewUrl } from '../upload/imageController.js';

dotenv.config();

// ** Create a new post ** //
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { caption, location, tags } = req.body;

    const usertoken = req.cookies.userjwt;

    if (!usertoken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const user_id = decodedToken.id; // Ensure that the token contains the user ID

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const creator_id = user.id;

        // Retrieve the image URL from the ImageStorage table using the static method
        const imageRecord = await Image_storages.findImageByReferenceKey(
          'creator_id',
          creator_id
        );
        if (!imageRecord) {
          return res.status(404).json({ message: 'Image not found' });
        }

        const newPost = await Post.create({
          caption: caption,
          imageUrl: imageRecord.imageUrl,
          location: location,
          tags: tags || '',
          created_at: new Date(),
          creator_id: user.id,
        });
        if (!newPost) {
          res.status(400).json({ message: 'Error creating new post.' });
          return;
        } else {
          res
            .status(201)
            .json({ message: 'Post created successfully', newPost });
        }
        return newPost;
      }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Delete File Method - Delete a file
export const deleteFile = async (
  res: Response,
  imageUrl: string
): Promise<void> => {
  try {
    const image = await Image_storages.findOne({
      where: { imageUrl: imageUrl },
    });

    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    await image.destroy();
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Update a Post ** //
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { caption, location, tags, imageUrl: newImageUrl } = req.body;
    const post_id = parseInt(req.query.post_id as string, 10);

    if (isNaN(post_id)) {
      res.status(400).json({ message: 'Invalid post ID' });
      return;
    }

    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decodedToken: any = jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string
    );
    const user_id = decodedToken?.id;

    if (!user_id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const post = await Post.findOne({
      where: { id: post_id, creator_id: user.id },
    });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (user_id !== user.id) {
      res.status(403).json({ message: 'Unauthorized attempt!' });
      return;
    }

    let imageUrl = post.imageUrl;

    if (newImageUrl) {
      try {
        const previewImageUrl = await getImagePreviewUrl(req, res);
        if (previewImageUrl === undefined) {
          res.status(404).json({ message: 'Image not found' });
          return;
        }
        if (typeof previewImageUrl === 'string') {
          imageUrl = previewImageUrl;
        } else {
          res.status(400).json({ message: 'Invalid image format' });
          return;
        }
      } catch (error) {
        res.status(400).json({ message: 'Image validation failed' });
        return;
      }
    }

    const updatedPost = await post.update({
      caption: caption || post.caption,
      imageUrl: imageUrl || post.imageUrl,
      location: location || post.location,
      tags: tags || post.tags,
      created_at: post.created_at,
      creator_id: user.id,
    });

    if (newImageUrl && !updatedPost) {
      await deleteFile(res, newImageUrl); // Clean up the uploaded image if update fails
    }

    res
      .status(200)
      .json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

// ** Get all posts ** //
export const getInfinitePosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.page as string, 10);
    const offset = page ? page * limit : 0;
    const posts = await Post.findAndCountAll({
      limit: limit,
      offset,
      order: [['created_at', 'DESC']],
    });
    res.status(200).json({
      posts,
      page: page,
      totalPages: Math.ceil(posts.count / limit),
      totalCount: posts.count,
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get all User's Liked Post count ** //
export const getUserLikedPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = parseInt(req.query.user_id as string, 10);
    if (!user_id) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    const likedPosts = Likes.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: Post, // Assuming you want to fetch full post details
          as: 'post', // Adjust the alias to match your association
        },
      ],
    });

    const posts = (await likedPosts).map((like: any) => like.post);
    if (posts.length === 0) {
      res.status(201).json({
        message: 'No liked posts found',
        post: [],
      });
      return;
    }

    res.status(200).json({
      message: 'Liked post count fetched successfully',
      likedPosts,
    });
  } catch (error) {
    console.error('Error getting liked post count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Like a Post ** //
// export const likePost = async (req: Request, res: Response) => {
//   try {
//     const { user_id, post_id } = req.body;

//     if (!user_id || !post_id) {
//       return res
//         .status(400)
//         .json({ message: 'User ID and Post ID are required' });
//     }

//     // Check if the user has already liked the post
//     const existingLike = await Likes.findOne({
//       where: {
//         user_id: user_id,
//         post_id: post_id,
//       },
//     });

//     if (existingLike) {
//       return res.status(400).json({ message: 'Post already liked' });
//     }

//     const like = await Likes.create({
//       user_id: user_id,
//       post_id: post_id,
//       created_at: new Date(),
//     });

//     res.status(201).json({ message: 'Post liked successfully', like });
//   } catch (error) {
//     console.error('Error liking post:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const getAllPosts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const post = await Post.findAll({
      include: [
        {
          model: User,
          attributes: [
            'id',
            'username',
            'email',
            'profilePic',
            'bio',
            'firstName',
            'lastName',
            'avatarUrl',
          ],
        },
      ],
    });
    res.status(200).json(post);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Get the most recent posts ** //
export const getRecentPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['firstName', 'lastName'],
        },
      ],
    });

    if (posts.length === 0) {
      res.status(404).json({ message: 'No posts found' });
      return;
    }

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts,
    });
  } catch (error) {
    console.error('Error getting recent posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Save a post ** //
// ** Function to save a post by user
export const savePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res
        .status(401)
        .json({ message: 'Unauthorized attempt! No token provided' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          console.log('JWT verification error', err.message);
          res.status(401).json({ message: 'Unauthorized Invalid Token' });
          return;
        }

        const user_id = decodedToken.id;
        if (!user_id) {
          res.status(400).json({ message: 'User ID is required' });
          return;
        }

        const post_id = parseInt(req.body.post_id as string, 10);

        if (!post_id) {
          res.status(400).json({ message: 'Post ID is required' });
          return;
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const post = await Post.findByPk(post_id);
        if (!post) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }

        const existingSave = await Saved_posts.findOne({
          where: { post_id: post_id, user_id: user_id },
        });
        if (existingSave) {
          res.status(400).json({ message: 'Post already saved' });
          return;
        }

        const newSave = await Saved_posts.createSave({
          id: user_id,
          user_id,
          post_id,
          saveDate: new Date(),
        });
        if (!newSave) {
          res.status(400).json({ message: 'Error saving post.' });
          return;
        }
        res
          .status(201)
          .json({ message: 'Post saved successfully', save: newSave });
      }
    );
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** LikePost Method - Like a post by user ** //
// ** Function to like a post by user
export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const user_id = decodedToken.id;

        const post_id = parseInt(req.body.post_id as string, 10);

        if (isNaN(post_id)) {
          res.status(400).json({ message: 'Invalid post ID' });
          return;
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const post = await Post.findByPk(post_id);
        if (!post) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }

        const existingLike = await Likes.findOne({
          where: { post_id: post_id, user_id: user_id },
        });
        if (existingLike) {
          res.status(400).json({ message: 'Post already liked' });
          return;
        }

        const newLike = await Likes.createLike({
          user_id,
          post_id,
          created_at: new Date(),
        });

        if (!post.likes_count) {
          post.likes_count = 0;
        }
        const likesCount = post.likes_count + 1;

        const updatedPost = await post.update({ likes_count: likesCount });
        if (!updatedPost) {
          res.status(400).json({ message: 'Error liking post.' });
          return;
        }

        res
          .status(201)
          .json({ message: 'Post liked successfully', like: newLike });
      }
    );
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Delete Post Method - Delete a post by user ** //
// ** Function to delete a post by user

// ** Delete a post
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usertoken =
      req.cookies.userjwt || req.headers.authorization?.split(' ')[1];

    if (!usertoken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const user_id = decodedToken.id;
        if (!user_id) {
          res.status(400).json({ message: 'User ID is required' });
          return;
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const post_id = parseInt(req.body.post_id as string, 10);

        if (!post_id) {
          res.status(400).json({ message: 'Post ID is required from server' });
          return;
        }

        const post = await Post.findByPk(post_id);
        if (!post) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }

        const existingSave = await Saved_posts.findOne({
          where: { post_id, user_id },
        });
        if (existingSave) {
          await existingSave.destroy();
        }

        // Find associated images and delete them
        if (post.imageUrl) {
          const image = await Image_storages.findOne({
            where: { imageUrl: post.imageUrl },
          });
          if (image) {
            await image.destroy();
          }
        }

        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
      }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ** Delete Liked Post Method - Delete a liked post by user ** //
// ** Function to delete a liked post by user
export const deleteLikedPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usertoken = req.cookies.userjwt;
    if (!usertoken) {
      res.status(401).json({ message: 'Unauthorized! No token provided' });
      return;
    }

    jwt.verify(
      usertoken,
      jwtUserENV.JWT_USER_SECRET as string,
      async (err: any, decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res
            .status(401)
            .json({ message: 'Unauthorized! Error Verifying Token' });
          return;
        }

        const user_id = decodedToken.id;
        if (!user_id) {
          res.status(400).json({ message: 'User ID is required' });
          return;
        }

        const post_id = parseInt(req.body.post_id as string, 10);

        if (!post_id) {
          res.status(400).json({ message: 'Post ID is required' });
          return;
        }

        const user = await User.findByPk(user_id);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const post = await Post.findByPk(post_id);
        if (!post) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }

        const existingLike = await Likes.findOne({
          where: { post_id: post_id, user_id: user_id },
        });
        if (!existingLike) {
          res.status(400).json({ message: 'Post not liked' });
          return;
        }
        await existingLike.destroy();

        let currentLikes = post.likes_count || 0;
        if (currentLikes > 0) {
          currentLikes -= 1;
        }

        const updatedPost = await post.update({ likes_count: currentLikes });
        if (!updatedPost) {
          res.status(400).json({ message: 'Error deleting liked post.' });
          return;
        }

        await post.save();

        res.status(200).json({
          message: 'Liked post deleted successfully',
          post: updatedPost,
        });
      }
    );
  } catch (error) {
    console.error('Error deleting liked post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  createPost,
  deleteFile,
  updatePost,
  getInfinitePosts,
  getUserLikedPost,
  likePost,
  getAllPosts,
  getRecentPosts,
  savePost,
  deletePost,
  deleteLikedPost,
};
