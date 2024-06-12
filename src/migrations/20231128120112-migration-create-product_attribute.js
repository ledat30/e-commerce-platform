"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductAttributes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      attributeValue1Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "AttributeValues",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      attributeValue2Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "AttributeValues",
          key: "id",
          onDelete: "CASCADE",
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
    await queryInterface.dropTable("ProductAttributes");
  },
};
