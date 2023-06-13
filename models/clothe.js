'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clothe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clothe.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  Clothe.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Clothe',
    tableName: 'Clothes',
    underscored: true,
  });
  return Clothe;
};