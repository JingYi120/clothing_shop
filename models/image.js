'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Clothe, { foreignKey: 'clotheId' })
    }
  }
  Image.init({
    name: DataTypes.STRING,
    isCover: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Image',
    tableName: 'Images',
    underscored: true,
  });
  return Image;
};