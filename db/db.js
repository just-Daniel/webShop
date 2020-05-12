Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);

sequelize = new Sequelize('webShop', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost',
});
console.log('we are here');

const Category = require('../models/category');
const Image = require('../models/image');
const User = require('../models/user');
const Item = require('../models/item');
const ShoppingCartItem = require('../models/shoppingCartItem');

// Item.hasMany(Image, {onDelete: 'cascade'});

sequelize.sync({force: true})
    .then(() => console.log('db started'))
    .catch((e) => console.log('Error start' + e));

