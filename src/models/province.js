"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Province.hasMany(models.District, { foreignKey: "provinceId" });
            Province.hasMany(models.User, { foreignKey: "provinceId" });
            Province.hasMany(models.Order, { foreignKey: "provinceId" });
        }
    }
    Province.init(
        {
            province_name: DataTypes.STRING,
            province_full_name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Province",
        }
    );
    return Province;
};
