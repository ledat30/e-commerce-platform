"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shipping.belongsTo(models.Order, { foreignKey: "orderId" });
      Shipping.belongsTo(models.ShippingUnit, {
        foreignKey: "shipping_unitId",
      });
    }
  }
  Shipping.init(
    {
      shipping_address: DataTypes.STRING,
      shipping_cost: DataTypes.FLOAT,
      orderId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      shipping_unitId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Shipping",
    }
  );
  return Shipping;
};
