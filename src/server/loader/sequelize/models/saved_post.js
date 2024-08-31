'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Saved_post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Saved_post.init(
    {
      user_id: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: 'Saved_post',
    }
  );
  return Saved_post;
};
