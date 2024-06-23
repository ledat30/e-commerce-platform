"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductAttribute extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProductAttribute.belongsTo(models.Product, { foreignKey: "productId" });
            ProductAttribute.belongsTo(models.AttributeValue, { as: 'AttributeValue1', foreignKey: 'attributeValue1Id' });
            ProductAttribute.belongsTo(models.AttributeValue, { as: 'AttributeValue2', foreignKey: 'attributeValue2Id' });
            ProductAttribute.hasMany(models.OrderItem, { foreignKey: "product_AttributeId" });
            ProductAttribute.hasMany(models.Inventory, { foreignKey: "product_AttributeId" });
        }
    }
    //object relational mapping
    ProductAttribute.init(
        {
            productId: DataTypes.INTEGER,
            attributeValue2Id: DataTypes.INTEGER,
            attributeValue1Id: DataTypes.INTEGER,
            isDelete: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "ProductAttribute",
        }
    );
    return ProductAttribute;
};
