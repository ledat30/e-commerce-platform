"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Ward extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Ward.hasMany(models.User, { foreignKey: "wardId" });
            Ward.hasMany(models.Order, { foreignKey: "wardId" });
            Ward.belongsTo(models.District, { foreignKey: "districtId" });
        }
    }
    Ward.init(
        {
            ward_name: DataTypes.STRING,
            ward_full_name: DataTypes.STRING,
            districtId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Ward",
        }
    );
    return Ward;
};
