"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Comment, { foreignKey: "productId" });
      Product.belongsTo(models.Category, { foreignKey: "categoryId" });
      Product.hasMany(models.Inventory, { foreignKey: "productId" });
      Product.hasMany(models.OrderItem, { foreignKey: "productId" });
      Product.belongsTo(models.Store, { foreignKey: "storeId" });
    }
  }
  Product.init(
    {
      price: DataTypes.FLOAT,
      product_name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      storeId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};