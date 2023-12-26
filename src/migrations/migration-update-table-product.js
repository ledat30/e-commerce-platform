module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Products", "old_price", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("Products", "promotion", {
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn("Products", "view_count", {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("Products", "sold", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
  },
};
