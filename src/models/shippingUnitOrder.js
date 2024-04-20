"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Shipping_Unit_Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Shipping_Unit_Order.belongsTo(models.ShippingUnit, { foreignKey: "shippingUnitId" });
            Shipping_Unit_Order.belongsTo(models.Order, { foreignKey: "orderId" });
            Shipping_Unit_Order.hasMany(models.Shipping, { foreignKey: "shipping_unit_orderId" });
        }
    }
    //object relational mapping
    Shipping_Unit_Order.init(
        {
            orderId: DataTypes.INTEGER,
            shippingUnitId: DataTypes.INTEGER,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Shipping_Unit_Order",
        }
    );
    return Shipping_Unit_Order;
};
