"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }
  Inventory.init(
    {
      quantyly: DataTypes.BIGINT,
      currentNumber: DataTypes.BIGINT,
      quantyly_in_stock: DataTypes.BIGINT,
      quantyly_ordered: DataTypes.BIGINT,
      quantyly_shipped: DataTypes.BIGINT,
      quantity_sold: DataTypes.BIGINT,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Inventory",
    }
  );
  return Inventory;
};
