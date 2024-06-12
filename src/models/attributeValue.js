"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class AttributeValue extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            AttributeValue.hasMany(models.ProductAttribute, { foreignKey: "attributeValue2Id" });
            AttributeValue.hasMany(models.ProductAttribute, { foreignKey: "attributeValue1Id" });
            AttributeValue.belongsTo(models.Attribute, { foreignKey: "attributeId" });
            AttributeValue.belongsTo(models.Store, { foreignKey: "storeId" });
        }
    }
    AttributeValue.init(
        {
            name: DataTypes.STRING,
            storeId: DataTypes.INTEGER,
            attributeId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "AttributeValue",
        }
    );
    return AttributeValue;
};
