'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.Clothe, { foreignKey: 'clotheId' })
      OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId' })
    }
  }
  OrderDetail.init({
    orderId: DataTypes.INTEGER,
    clotheId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'OrderDetails',
    underscored: true,
  });
  return OrderDetail;
};