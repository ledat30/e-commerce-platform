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
      Inventory.belongsTo(models.ProductAttribute, { foreignKey: "product_AttributeId" });
      Inventory.belongsTo(models.Store, { foreignKey: "storeId" });
    }
  }
  Inventory.init(
    {
      quantyly: DataTypes.BIGINT,
      currentNumber: DataTypes.BIGINT,
      quantyly_ordered: DataTypes.BIGINT,
      quantyly_shipped: DataTypes.BIGINT,
      quantity_sold: DataTypes.BIGINT,
      product_AttributeId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Inventory",
    }
  );
  return Inventory;
};
