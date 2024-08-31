import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConInstance } from '../../sequelizeCon.js';

// ** Define the follow Interface ** //
interface FollowAttributes {
  follower_id: number;
  following_id: number;
  created_at: Date; // Date the follow was created
  status: 'follow' | 'unfollow' | 'block';
}

interface FollowCreationAttributes
  extends Optional<FollowAttributes, 'created_at' | 'status'> {}

// ** Define Instance of Sequelize ** //
const sequelize = sequelizeConInstance();

// ** Define the Follow Model ** //
class Follows extends Model<FollowAttributes, FollowCreationAttributes> {
  declare follower_id: number;
  declare following_id: number;
  declare created_at: Date;
  declare status: 'follow' | 'unfollow' | 'block';
}

// ** Define the Follow Model ** //

Follows.init(
  {
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      primaryKey: true,
    },
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('follow', 'unfollow', 'block'),
      allowNull: false,
      defaultValue: 'follow',
    },
  },
  {
    sequelize,
    modelName: 'Follows',
    timestamps: false,
    freezeTableName: true,
  }
);

// ** Sync the model with the database ** //
await sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('New Follow synced successfully');
  })
  .catch(err => {
    console.error('Error syncing Follow Table:', err);
  });

export default Follows;
