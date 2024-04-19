"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shippings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      shipping_address: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      shipping_cost: {
        type: Sequelize.FLOAT,
      },
      shipping_unit_orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Shipping_Unit_Orders",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Shippings");
  },
};
