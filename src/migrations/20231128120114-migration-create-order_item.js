"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      price_per_item: {
        type: Sequelize.FLOAT,
      },
      quantily: {
        type: Sequelize.BIGINT,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      product_AttributeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "ProductAttributes",
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
    await queryInterface.dropTable("OrderItems");
  },
};
