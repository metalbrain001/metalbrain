import { DataTypes, Model, Optional } from 'sequelize';
import Post from '../../models/post/post.model.js';
import User from '../../models/user/user.model.js';
import { sequelizeConInstance } from '../../sequelizeCon.js';

interface SavesAttributes {
  id: number;
  user_id: number;
  post_id: number;
  saveDate: Date | undefined;
}

interface SavesCreationAttributes extends Optional<SavesAttributes, 'id'> {}
// Define Instance of Sequelize
const sequelize = sequelizeConInstance();

class Saved_posts
  extends Model<SavesAttributes, SavesCreationAttributes>
  implements SavesAttributes
{
  declare id: number;
  declare user_id: number;
  declare post_id: number;
  declare saveDate: Date | undefined;

  // Create custom class methods to create a new post
  static async createSave(
    attributes: SavesCreationAttributes
  ): Promise<Saved_posts> {
    return await this.create(attributes);
  }

  // create custom method to check if post is saved
  static async checkIfSaved(
    user_id: number,
    post_id: number
  ): Promise<boolean> {
    const save = await this.findOne({ where: { user_id, post_id } });
    return !!save;
  }

  // create custom method to delete a saved post
  static async deleteSavedPost(post_id: number): Promise<void> {
    const save = await this.findOne({ where: { post_id } });
    if (save) {
      await save.destroy();
    }
  }

  // create custom method to get all saved posts
  static async getSavedPosts(user_id: number): Promise<Saved_posts[]> {
    return await this.findAll({
      where: { user_id },
      include: [
        {
          model: Post,
          as: 'Post',
        },
      ],
    });
  }
}

// Define the Saves model
Saved_posts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id',
      },
    },
    saveDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Saved_posts',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'post_id'],
      },
    ],
  }
);

// Create a function to delete saved Post using the static method
Saved_posts.deleteSavedPost = async function (post_id: number): Promise<void> {
  const save = await this.findOne({ where: { post_id } });
  if (save) {
    await save.destroy();
  }
};

// Create relationship between Saves and Posts
Saved_posts.belongsTo(Post, {
  foreignKey: 'post_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

// Create relationship between Saves and Users
Saved_posts.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
});

Saved_posts.sync({ alter: false })
  .then(() => {
    console.log('Save Post synced successfully');
  })
  .catch(err => {
    console.error('Error syncing Save post:', err);
  });

export default Saved_posts;
