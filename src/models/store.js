"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Store.hasMany(models.Product, { foreignKey: "storeId" });
      Store.hasMany(models.Inventory, { foreignKey: "storeId" });
      Store.hasMany(models.AttributeValue, { foreignKey: "storeId" });
      Store.hasMany(models.Attribute, { foreignKey: "storeId" });
      Store.hasMany(models.Order, { foreignKey: "storeId" });
    }
  }
  Store.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
