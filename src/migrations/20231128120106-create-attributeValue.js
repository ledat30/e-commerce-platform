"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AttributeValues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      attributeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Attributes",
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
    await queryInterface.dropTable("AttributeValues");
  },
};
