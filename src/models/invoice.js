"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Invoice.belongsTo(models.PaymentMethod, {
        foreignKey: "payment_methodID",
      });
      Invoice.belongsTo(models.Order, { foreignKey: "orderId" });
    }
  }
  Invoice.init(
    {
      invoice_date: DataTypes.DATE,
      total_amount: DataTypes.STRING,
      orderId: DataTypes.INTEGER,
      payment_methodID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Invoice",
    }
  );
  return Invoice;
};
