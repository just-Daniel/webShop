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
            if (item.count > 0) {
              tokenUtils.getUserToken(request)
                  .then((user) => {
                    ShopCart.create({
                      itemId: item.id,
                      userId: user.id,
                      count: 1,
                    }).then((res) => resolve(res))
                        .catch((err) => reject(new ResponseError(err, 500)));
                  })
                  .catch((err) => reject(new ResponseError(err, 400)));
            } else {
              reject(new ResponseError('Sorry, the product is missing', 417));
            }
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Incorrect query' + err, 400)));
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
            reject(new ResponseError('Id not found', 404));
          }
        });
  });
  return promise;
};


const addOneOrMoreItems = (id, addItem, request) => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findByPk(id, {
      include: [{
        model: Item,
        attributes: ['count']}],
      raw: true,
    })
        .then((item)=> {
          if (item) {
            const maxCount = item['item.count'];
            const total = item.count + +addItem;

            if (total <= maxCount) {
              ShopCart.update({count: total}, {where: {id: item.id}})
                  .then(() => resolve({status: 'OK'}))
                  .catch((err) => reject(new ResponseError(err, 500)));
            } else {
              reject(new ResponseError(
                  `Sorry, the maximum number of items ${maxCount}`, 400));
            }
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Incorrect query' + err, 400)));
  });
  return promise;
};


const removeOneOrMoreItems = (id, subtractItem) => {
  const promise = new Promise((resolve, reject) => {
    ShopCart.findByPk(id, {
      include: [{
        model: Item,
        attributes: ['count']}],
      raw: true,
    })
        .then((item)=> {
          if (item) {
            let total = item.count - +subtractItem;

            if (total > 0) {
              ShopCart.update({count: total}, {where: {id: item.id}})
                  .then(() => resolve({status: 'OK'}))
                  .catch((err) => reject(new ResponseError(err, 500)));
            } else {
              total = 1;
              ShopCart.update({count: total}, {where: {id: item.id}})
                  .then(() => resolve({status: 'Minimum sum of items are 1'}))
                  .catch((err) => reject(new ResponseError(err, 500)));
            }
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Incorrect query' + err, 400)));
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
