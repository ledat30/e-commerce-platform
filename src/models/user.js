"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Group, { foreignKey: "groupId" });
      User.belongsTo(models.Province, { foreignKey: "provinceId" });
      User.belongsTo(models.District, { foreignKey: "districtId" });
      User.belongsTo(models.Ward, { foreignKey: "wardId" });
      User.hasMany(models.Order, { foreignKey: "userId" });
      User.hasMany(models.Comment, { foreignKey: "userId" });
      User.hasOne(models.Store, { foreignKey: "userId", as: "store" });
      User.hasMany(models.ShippingUnit, { foreignKey: "userId" });
      User.hasMany(models.Shipping_Unit_Order_user, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      provinceId: DataTypes.INTEGER,
      districtId: DataTypes.INTEGER,
      wardId: DataTypes.INTEGER,
      email: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      groupId: DataTypes.INTEGER,
      phonenumber: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
