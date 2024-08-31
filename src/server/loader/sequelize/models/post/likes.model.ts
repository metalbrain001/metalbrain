import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConInstance } from '../../sequelizeCon.js';
import Post from '../post/post.model.js';
import User from '../user/user.model.js';

// ** Define the Like Interface
interface LikeAttributes {
  id: number;
  user_id: number;
  post_id: number;
  created_at: Date;
}

interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> {}

// ** Define Instance of Sequelize
const sequelize = sequelizeConInstance();

class Likes
  extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes
{
  declare id: number;
  declare user_id: number;
  declare post_id: number;
  declare created_at: Date;

  // ** create a static method to create a new like
  static async createLike(attributes: LikeCreationAttributes): Promise<Likes> {
    return await this.create(attributes);
  }
}

// ** Initialize the Like Model
Likes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Likes',
    timestamps: false,
    freezeTableName: true,
  }
);

// ** Define the relationship between User and Like
User.hasMany(Likes, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// ** Define the relationship between Post and Like
Likes.belongsTo(User, {
  foreignKey: 'user_id',
});

// ** Define the relationship between Post and Like
Post.hasMany(Likes, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});

Likes.belongsTo(Post, {
  foreignKey: 'post_id',
});

// ** Sync the Like model with the database
Likes.sync({ alter: false })
  .then(() => {
    console.log('Like synced successfully');
  })
  .catch(err => {
    console.error('Error syncing like:', err);
  });

export default Likes;
