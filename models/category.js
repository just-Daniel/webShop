const Category = sequelize.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  parentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    hierarchy: true,
  },
});

module.exports = Category;
