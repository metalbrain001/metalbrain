'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image_storage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Image_storage.init(
    {
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Image_storage',
    }
  );
  return Image_storage;
};
