"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Shipping_Unit_Order_user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Shipping_Unit_Order_user.belongsTo(models.Shipping_Unit_Order, { foreignKey: "shipping_unit_orderId" });
            Shipping_Unit_Order_user.belongsTo(models.User, { foreignKey: "userId" });
        }
    }
    //object relational mapping
    Shipping_Unit_Order_user.init(
        {
            userId: DataTypes.INTEGER,
            shipping_unit_orderId: DataTypes.INTEGER,
            status: DataTypes.STRING,
            reason: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Shipping_Unit_Order_user",
        }
    );
    return Shipping_Unit_Order_user;
};
