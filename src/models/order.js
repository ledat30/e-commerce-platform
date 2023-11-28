"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "userId" });
      Order.belongsTo(models.PaymentMethod, { foreignKey: "payment_methodID" });
      Order.hasMany(models.Invoice, { foreignKey: "orderId" });
      Order.hasMany(models.Shipping, { foreignKey: "orderId" });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
    }
  }
  Order.init(
    {
      total_amount: DataTypes.STRING,
      order_date: DataTypes.DATE,
      payment_methodID: DataTypes.INTEGER,
      status: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
