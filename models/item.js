const Item = sequelize.define('item', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  image: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'images',
      key: 'id',
    },
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isEnabled: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Item;
