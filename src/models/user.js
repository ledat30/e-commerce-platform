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
      User.belongsTo(models.Role, { foreignKey: "roleId" });
      User.hasMany(models.Order, { foreignKey: "userId" });
      User.hasMany(models.Comment, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      roleId: DataTypes.INTEGER,
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
