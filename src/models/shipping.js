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
      Shipping.belongsTo(models.Shipping_Unit_Order, {
        foreignKey: "shipping_unit_orderId",
      });
    }
  }
  Shipping.init(
    {
      shipping_address: DataTypes.STRING,
      shipping_cost: DataTypes.FLOAT,
      status: DataTypes.STRING,
      shipping_unit_orderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Shipping",
    }
  );
  return Shipping;
};
