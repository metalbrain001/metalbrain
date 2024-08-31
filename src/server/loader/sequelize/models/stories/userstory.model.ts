import { DataTypes, Model, Optional } from 'sequelize';
import User from '../../models/user/user.model.js';
import { sequelizeConInstance } from '../../sequelizeCon.js';

// ** Define the UsersStories Interface ** //
interface UserStoriesAttributes {
  id: number;
  user_id: number;
  storyUrl: string;
  created_at: Date;
  expires_at: Date;
}

interface UserStoriesCreationAttributes
  extends Optional<UserStoriesAttributes, 'id'> {}

// ** Define Instance of Sequelize ** //
const sequelize = sequelizeConInstance();

// ** Define the UsersStories Model ** //
class UserStories extends Model<
  UserStoriesAttributes,
  UserStoriesCreationAttributes
> {
  declare id: number;
  declare user_id: number;
  declare storyUrl: string;
  declare createdAt: Date;
  declare expiresAt: Date;

  static async getUserStory(user_id: number): Promise<UserStories | null> {
    return await this.findOne({
      where: { user_id: user_id },
    });
  }

  static async updateStory(
    id: number,
    attributes: Partial<UserStoriesAttributes>
  ): Promise<[number, UserStories[]]> {
    const [affectedCount, updatedStory] = await this.update(attributes, {
      where: { id },
      returning: true,
    });
    return [affectedCount, updatedStory as UserStories[]];
  }

  // ** Create a static method to update a story by reference ID ** //
  static async updateStoryByReferenceKey(
    key: string,
    value: number,
    update: Partial<UserStoriesAttributes>
  ): Promise<UserStories | null> {
    try {
      const story = await this.findOne({
        where: { [key]: value },
      });
      if (!story) {
        return null;
      }
      await story.update(update);
      return story;
    } catch (error) {
      console.error(
        `Error updating story by reference key: ${key}, value: ${value}`,
        error
      );
      throw error; // Re-throw the error after logging it
    }
  }

  // ** Create a static method to find a story by reference ID ** //
  static async findStoryByReferenceKey(
    key: string,
    value: number
  ): Promise<UserStories | null> {
    try {
      const story = await this.findOne({
        where: { [key]: value },
        order: [['createdAt', 'DESC']],
      });
      return story;
    } catch (error) {
      console.error(
        `Error finding story by reference key: ${key}, value: ${value}`,
        error
      );
      throw error; // Re-throw the error after logging it
    }
  }
}

// ** Initialize the UsersStories Model ** //
UserStories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    storyUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserStories',
    timestamps: false,
    freezeTableName: true,
  }
);

UserStories.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
});
User.hasMany(UserStories, {
  foreignKey: 'user_id',
  sourceKey: 'id',
});

// ** Sync the UsersStories Model ** //
await sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('UsersStories model synced');
  })
  .catch(err => {
    console.error('Error syncing UsersStories model:', err);
  });

export default UserStories;
