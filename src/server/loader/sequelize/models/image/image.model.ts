import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConInstance } from '../../sequelizeCon.js';
import Post from '../post/post.model.js';

// ** Define the ImageStorage Interface
interface ImageStorageAttributes {
  id: number;
  imageUrl: string | null;
  post_id: number | null;
  created_at: Date;
  creator_id: number;
}

// ** Define the ImageStorage Creation Attributes
interface ImageStorageCreationAttributes
  extends Optional<ImageStorageAttributes, 'id'> {}

// ** Define Instance of Sequelize
const sequelize = sequelizeConInstance();

// ** Define the ImageStorage Model
class Image_storages
  extends Model<ImageStorageAttributes, ImageStorageCreationAttributes>
  implements ImageStorageAttributes
{
  declare id: number;
  declare imageUrl: string | null;
  declare post_id: number | null;
  declare created_at: Date;
  declare creator_id: number;

  // create a static method to find an image by ID
  static async findImageById(id: number): Promise<Image_storages | null> {
    return await this.findByPk(id);
  }

  static async findImageByReferenceKey(
    key: string,
    value: number
  ): Promise<Image_storages | null> {
    try {
      const image = await this.findOne({
        where: { [key]: value },
        order: [['created_at', 'DESC']],
      });
      return image;
    } catch (error) {
      console.error(
        `Error finding image by reference key: ${key}, value: ${value}`,
        error
      );
      throw error; // Re-throw the error after logging it
    }
  }
}

// ** Define the ImageStorage Model
Image_storages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Post',
        key: 'id',
      },
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
    modelName: 'Image_storages',
    timestamps: false,
    freezeTableName: true,
  }
);

Post.hasMany(Image_storages, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Image_storages.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// ** sync the ImageStorage model with the database
await sequelize
  .sync({ force: false })
  .then(() => {
    console.log('New Image synced successfully');
  })
  .catch(err => {
    console.error('Error syncing new image:', err);
  });

export default Image_storages;
