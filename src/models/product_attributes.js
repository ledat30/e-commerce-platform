"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Attribute extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Attribute.belongsTo(models.Store, { foreignKey: "storeId" });
            Attribute.hasMany(models.AttributeValue, { foreignKey: "attributeId" });
            Attribute.belongsTo(models.Category, { foreignKey: "categoryId" });
        }
    }
    Attribute.init(
        {
            name: DataTypes.STRING,
            storeId: DataTypes.INTEGER,
            categoryId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Attribute",
        }
    );
    return Attribute;
};
