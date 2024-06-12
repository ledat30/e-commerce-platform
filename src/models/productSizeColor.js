"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_size_color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Product_size_color.belongsTo(models.Product, { foreignKey: "productId" });
      Product_size_color.belongsTo(models.Size, { foreignKey: "sizeId" });
      Product_size_color.belongsTo(models.Color, { foreignKey: "colorId" });
      // Product_size_color.hasMany(models.OrderItem, { foreignKey: "productColorSizeId" });
      // Product_size_color.hasMany(models.Inventory, { foreignKey: "productColorSizeId" });
    }
  }
  //object relational mapping
  Product_size_color.init(
    {
      productId: DataTypes.INTEGER,
      colorId: DataTypes.INTEGER,
      sizeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product_size_color",
    }
  );
  return Product_size_color;
};
