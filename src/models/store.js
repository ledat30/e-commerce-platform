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
      Store.hasMany(models.Size, { foreignKey: "storeId" });
      Store.hasMany(models.Color, { foreignKey: "storeId" });
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
