module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Products", "contentHtml", {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      }),
      queryInterface.addColumn("Products", "contentMarkdown", {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      }),
    ]);
  },
};
