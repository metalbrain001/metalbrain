import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConInstance } from '../../sequelizeCon.js';
import User from '../user/user.model.js';

interface PostAttributes {
  id: number;
  caption: string;
  imageUrl: string | null;
  location: string | null;
  tags: string;
  likes_count: number | null;
  created_at: Date | undefined;
  creator_id: number;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

// Define Instance of Sequelize
const sequelize = sequelizeConInstance();

class Post extends Model<PostAttributes, PostCreationAttributes> {
  declare id: number;
  declare caption: string;
  declare imageUrl: string | null;
  declare location: string | null;
  declare tags: string;
  declare likes_count: number | null;
  declare created_at: Date | undefined;
  declare creator_at: number;

  // create a static method to create a new post
  static async createPost(attributes: PostCreationAttributes): Promise<Post> {
    return await this.create(attributes);
  }

  static async updatePost(
    id: number,
    attributes: PostAttributes
  ): Promise<[number, Post[]]> {
    const [affectedCount, updatedPosts] = await this.update(attributes, {
      where: { id },
      returning: true,
    });
    return [affectedCount, updatedPosts as Post[]];
  }

  // declare static methods to delete a Post by ID
  static async deletePost(id: number): Promise<void> {
    const post = await this.findOne({ where: { id } });
    if (post) {
      await post.destroy();
    }
  }

  // declare static methods to get all posts
  static async getAllPosts(): Promise<Post[]> {
    return await this.findAll();
  }

  // declare static methods to get infinite posts
  static async getInfinitePosts(
    offset: number,
    limit: number
  ): Promise<Post[]> {
    return await this.findAll({ offset, limit });
  }

  // declare static methods to get post by ID
  static async getPostByID(post_id: number): Promise<Post | null> {
    return await this.findOne({ where: { id: post_id } });
  }

  // declare static methods to get user's posts
  static async getUserPosts(user_id: number): Promise<Post[]> {
    return await this.findAll({ where: { creator_id: user_id } });
  }

  // declare static methods to get Saved post by post ID
  static async getSavedPost(post_id: number): Promise<Post | null> {
    return await this.findOne({ where: { id: post_id } });
  }

  // declare static methods to get post by reference ID (creator_Id)
  static async getPostByReferenceID(creator_id: number): Promise<Post | null> {
    return await this.findOne({ where: { creator_id } });
  }
}

// Sync the model with the database
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Post',
    timestamps: false,
    freezeTableName: true,
  }
);

// Create new post
Post.createPost = async function (
  attributes: PostCreationAttributes
): Promise<Post> {
  try {
    const newPost = await this.create(attributes);
    return newPost;
  } catch (error) {
    console.error('Error creating new post:', error);
    throw error;
  }
};

// Update post by ID
Post.updatePost = async function (
  id: number,
  attributes: PostAttributes
): Promise<[number, Post[]]> {
  try {
    const [affectedCount, updatedPosts] = await this.update(attributes, {
      where: { id },
      returning: true,
    });
    return [affectedCount, updatedPosts as Post[]];
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// infinite posts
Post.getInfinitePosts = async function (
  offset: number,
  limit: number
): Promise<Post[]> {
  try {
    const posts = await this.findAll({ offset, limit });
    return posts;
  } catch (error) {
    console.error('Error getting infinite posts:', error);
    throw error;
  }
};

// Get search results - posts
Post.getPostByID = async function (id: number): Promise<Post | null> {
  try {
    const post = await this.findOne({ where: { id } });
    return post;
  } catch (error) {
    console.error('Error getting post by ID:', error);
    throw error;
  }
};

// Get user's posts
Post.getUserPosts = async function (user_id: number): Promise<Post[]> {
  try {
    const posts = await this.findAll({ where: { creator_id: user_id } });
    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// Define the relationship between the User and Post models
User.hasMany(Post, {
  foreignKey: 'creator_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Post.belongsTo(User, {
  foreignKey: 'creator_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('Post synced successfully');
  })
  .catch(err => {
    console.error('Error syncing Post:', err);
  });

export default Post;
