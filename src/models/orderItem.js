"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
      OrderItem.belongsTo(models.Product_size_color, { foreignKey: "productColorSizeId" });
    }
  }
  OrderItem.init(
    {
      price_per_item: DataTypes.STRING,
      quantily: DataTypes.STRING,
      orderId: DataTypes.INTEGER,
      productColorSizeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );
  return OrderItem;
};
