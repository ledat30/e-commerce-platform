"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Inventories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      quantyly: {
        type: Sequelize.BIGINT,
      },
      currentNumber: {
        type: Sequelize.BIGINT,
      },
      quantyly_ordered: {
        type: Sequelize.BIGINT,
      },
      quantyly_shipped: {
        type: Sequelize.BIGINT,
      },
      quantity_sold: {
        type: Sequelize.BIGINT,
      },
      productColorSizeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Product_size_colors",
          key: "id",
        },
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Stores",
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
    await queryInterface.dropTable("Inventories");
  },
};
