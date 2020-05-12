const ShopingCartItem = sequelize.define('shopingCartItem', {
  items: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'items',
      key: 'id',
    },
  },
  user: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  count: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = ShopingCartItem;
