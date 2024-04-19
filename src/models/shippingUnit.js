"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShippingUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShippingUnit.belongsTo(models.User, { foreignKey: "userId" });
      ShippingUnit.hasMany(models.Shipping_Unit_Order, { foreignKey: "shippingUnitId" });
    }
  }
  ShippingUnit.init(
    {
      shipping_unit_name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ShippingUnit",
    }
  );
  return ShippingUnit;
};
