const ShopingCartItem = sequelize.define('shopingCartItem', {
  itemId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'items',
      key: 'id',
    },
  },
  userId: {
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
