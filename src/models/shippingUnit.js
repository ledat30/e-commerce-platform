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
      ShippingUnit.hasMany(models.Shipping, { foreignKey: "shipping_unitId" });
    }
  }
  ShippingUnit.init(
    {
      shipping_unit_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ShippingUnit",
    }
  );
  return ShippingUnit;
};
