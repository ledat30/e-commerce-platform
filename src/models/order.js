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
      Order.belongsTo(models.Province, { foreignKey: "provinceId" });
      Order.belongsTo(models.District, { foreignKey: "districtId" });
      Order.belongsTo(models.Ward, { foreignKey: "wardId" });
      Order.belongsTo(models.PaymentMethod, { foreignKey: "payment_methodID" });
      Order.hasMany(models.Invoice, { foreignKey: "orderId" });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
      Order.belongsTo(models.Store, { foreignKey: "storeId" });
      Order.hasMany(models.Shipping_Unit_Order, { foreignKey: "orderId" });
    }
  }
  Order.init(
    {
      total_amount: DataTypes.STRING,
      order_date: DataTypes.DATE,
      payment_methodID: DataTypes.INTEGER,
      status: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      provinceId: DataTypes.INTEGER,
      districtId: DataTypes.INTEGER,
      wardId: DataTypes.INTEGER,
      address_detail: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      customerName: DataTypes.STRING,
      storeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
