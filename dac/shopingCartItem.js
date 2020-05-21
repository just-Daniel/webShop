const ShopCart = require('../models/shopingCartItem');
const Item = require('../models/item');
const User = require('../models/user');
const Category = require('../models/category');
const tokenUtils = require('../routes/auth/token-utils');
const ResponseError = require('../routes/auth/response-error');

const addItem = (id, request) => {
  const promise = new Promise((resolve, reject) => {
    Item.findByPk(id, {raw: true})
        .then((item) => {
          if (item) {
            console.log('item', item);
            tokenUtils.getUserToken(request)
                .then((user) => {
                  console.log('user', user);
                  ShopCart.create({
                    itemId: item.id,
                    userId: user.id,
                    count: item.count,
                  }).then((res) => resolve(res))
                      .catch((err) => reject(new ResponseError(err, 500)));
                })
                .catch((err) => reject(new ResponseError(err, 400)));
          } else {
            reject(new ResponseError('Id not found', 400));
          }
        })
        .catch((err) => reject(new ResponseError('Incorrect query' + err, 400)));
  });
  return promise;
};


const addOneOrMoreItems = (id, request) => {
  const promise = new Promise((resolve, reject) => {
    const sumId = id.match(/\d+/gi).map(Number);
    const result = sumId.length;

    const addItemToCart = () => {
      if (sumId.length === 0) {
        resolve({status: `Add ${result} items`});
      } else {
        Item.findByPk(sumId[0], {raw: true})
            .then((item) => {
              if (item) {
                tokenUtils.getUserToken(request)
                    .then((user) => {
                      ShopCart.create({
                        itemId: item.id,
                        userId: user.id,
                        count: item.count,
                      }).catch((err) => reject(new ResponseError(err, 500)));
                    })
                    .catch((err) => reject(new ResponseError(err, 400)));
                sumId.shift(0);
                addItemToCart();
              } else {
                reject(new ResponseError('Id not found', 400));
              }
            })
            .catch((err) => reject(new ResponseError('Incorrect query' + err, 400)));
      }
    };
    addItemToCart();
  });
  return promise;
};


const removeItem = (id) => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findByPk(id)
        .then((item) => {
          if (item) {
            ShopCart.destroy({where: {id: id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(err, 500)));
          } else {
            reject(new ResponseError('Id not found', 400));
          }
        });
  });
  return promise;
};


const removeOneOrMoreItems = (id) => {
  const promise = new Promise((resolve, reject) => {
    const sumId = id.match(/\d+/gi);
    const result = sumId.length;

    const removeItemWithCart = () => {
      if (sumId.length === 0) {
        resolve({status: `Removed ${result} items`});
      } else {
        ShopCart.findByPk(sumId[0], {raw: true})
            .then((item) => {
              if (item) {
                ShopCart.destroy({where: {id: item.id}})
                    .catch((err) => reject(new ResponseError(err, 500)));
                sumId.shift(0);
                removeItemWithCart();
              } else {
                reject(new ResponseError(`Id ${sumId[0]} not found`, 400));
              }
            })
            .catch((err) => reject(new ResponseError('Incorrect query' + err, 400)));
      }
    };
    removeItemWithCart();
  });
  return promise;
};


const getAllItems = () => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findAll({include: [
      {model: Item, include: {model: Category}},
      {model: User}]})
        .then((items) => resolve(items))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const getCountsItems = () => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'counts'],
      ],
      raw: true,
    })
        .then((count) => {
          ShopCart.findAll({include: [Item], raw: true})
              .then((res) => resolve([res, count]))
              .catch((err) => reject(new ResponseError(err, 500)));
        })
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const getItemAndPrice = () => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findAll({
      attributes: [],
      include: [{
        model: Item,
        attributes: ['name', 'price'],
      }],
      raw: true,
    })
        .then((items) => resolve(items))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const getOverallPriceItems = () => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('item.price')), 'total'],
      ],
      include: [{
        model: Item,
        attributes: [],
      }],
      raw: true,
    })
        .then((items) => resolve(items))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const purchaseItems = () => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findAll().then((items) => {
      if (items == 0) {
        reject(new ResponseError('Please add item to cart', 400));
      } else {
        ShopCart.destroy({
          where: {},
          truncate: true,
        })
            .then(() => resolve({status: 'bought'}))
            .catch((err) => reject(new ResponseError(err, 500)));
      }
    });
  });
  return promise;
};

module.exports.addItem = addItem;
module.exports.addOneOrMoreItems = addOneOrMoreItems;
module.exports.removeItem = removeItem;
module.exports.removeOneOrMoreItems = removeOneOrMoreItems;
module.exports.getAllItems = getAllItems;
module.exports.getCountsItems = getCountsItems;
module.exports.getItemAndPrice = getItemAndPrice;
module.exports.getOverallPriceItems = getOverallPriceItems;
module.exports.purchaseItems = purchaseItems;
