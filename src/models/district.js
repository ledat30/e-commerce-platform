"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class District extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            District.belongsTo(models.Province, { foreignKey: "provinceId" });
            District.hasMany(models.User, { foreignKey: "districtId" });
            District.hasMany(models.Order, { foreignKey: "districtId" });
            District.hasMany(models.Ward, { foreignKey: "districtId" });
        }
    }
    District.init(
        {
            district_name: DataTypes.STRING,
            district_full_name: DataTypes.STRING,
            provinceId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "District",
        }
    );
    return District;
};
