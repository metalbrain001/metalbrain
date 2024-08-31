'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile_picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile_picture.init(
    {
      profilePic: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Profile_picture',
    }
  );
  return Profile_picture;
};
