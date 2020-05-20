const ShopingCartItem = sequelize.define('shopingCartItem', {
  count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = ShopingCartItem;
