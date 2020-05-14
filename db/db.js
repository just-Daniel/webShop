Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);

sequelize = new Sequelize('webShop', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost',
  define: {timestamps: false},
});
console.log('we are here');

const Category = require('../models/category');
const Image = require('../models/image');
const User = require('../models/user');
const Item = require('../models/item');
const ShoppingCartItem = require('../models/shopingCartItem');

Category.hasMany(Item, {foreignKey: {allowNull: false}});
Item.belongsTo(Category);

Item.belongsToMany(Image, {
  through: 'ItemsImages',
  onDelete: 'cascade'});
Image.belongsToMany(Item, {through: 'ItemsImages'});

sequelize.sync()
// sequelize.sync({force: true})
    .then(() => console.log('db started'))
    .catch((e) => console.log('Error start' + e));

