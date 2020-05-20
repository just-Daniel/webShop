const ShopCart = require('../models/shopingCartItem');
const Item = require('../models/item');
const User = require('../models/user');
const tokenUtils = require('./auth/token-utils');
const Category = require('../models/category');

app.post('/cart/add-item', (request, response) => {
  const data = request.query;

  Item.findByPk(data.id, {raw: true})
      .then((item) => {
        if (item) {
          tokenUtils.getUserToken(request)
              .then((user) => {
                ShopCart.create({
                  itemId: item.id,
                  userId: user.id,
                  count: item.count,
                }).then((res) => response.send(res))
                    .catch((err) => {
                      console.log('err', err);
                      response.status(500).send({
                        error: 'Error add item to cart' + err});
                    });
              })
              .catch((err) => response.status(400).send(err));
        } else {
          response.status(400).send({error: 'Id not found'});
        }
      })
      .catch((err) => response.status(400).send({error: 'Incorrect query' + err}));
});

app.delete('/cart/remove-item', (request, response) => {
  const data = request.query;

  ShopCart.findByPk(data.id)
      .then((item) => {
        if (item) {
          ShopCart.destroy({where: {id: data.id}})
              .then(() => response.send({status: 'OK'}))
              .catch((err) => response.status(500).send({
                error: 'unable to deleted' + err}));
        } else {
          response.status(400).send({error: 'Id not found'});
        }
      });
});


app.post('/cart/add-one-more-item', (request, response) => {
  const data = request.query;

  const myId = data.id;
  const sumId = myId.match(/\d+/gi).map(Number);
  const result = sumId.length;

  const addItemToCart = () => {
    if (sumId.length === 0) {
      response.send({status: `Add ${result} items`});
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
                    }).catch((err) => {
                      response.status(500).send({
                        error: 'Error add item to cart' + err});
                    });
                  })
                  .catch((err) => response.status(400).send(err));
              sumId.shift(0);
              addItemToCart();
            } else {
              response.status(400).send({error: 'Id not found'});
            }
          })
          .catch((err) => response.status(400).send({error: 'Incorrect query' + err}));
    }
  };
  addItemToCart();
});


app.delete('/cart/remove-one-more-item', (request, response) => {
  const data = request.query;

  const sumId = data.id.match(/\d+/gi);
  const result = sumId.length;

  const removeItemWithCart = () => {
    if (sumId.length === 0) {
      response.send({status: `Removed ${result} items`});
    } else {
      ShopCart.findByPk(sumId[0], {raw: true})
          .then((item) => {
            if (item) {
              ShopCart.destroy({where: {id: item.id}})
                  .catch((err) => response.status(500).send({
                    error: 'unable to deleted' + err}));
              sumId.shift(0);
              removeItemWithCart();
            } else {
              response.status(400).send({error: `Id ${sumId[0]} not found`});
            }
          })
          .catch((err) => response.status(400).send({error: 'Incorrect query' + err}));
    }
  };
  removeItemWithCart();
});

app.get('/cart', (request, response) => {
  ShopCart.findAll({include: [
    {model: Item, include: {model: Category}},
    {model: User}]})
      .then((res) => response.send(res))
      .catch((err) => {
        console.log(err);

        response.status(500).send(err);
      });
});


app.get('/cart/details/counts', (request, response) => {
  ShopCart.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'counts'],
    ],
    raw: true,
  })
      .then((count) => {
        ShopCart.findAll({include: [Item], raw: true})
            .then((res) => response.send([res, count]))
            .catch((err) => response.status(500).send(err));
      })
      .catch((err) => response.status(500).send(err));
});


app.get('/cart/details/item-price', (request, response) => {
  ShopCart.findAll({
    attributes: [],
    include: [{
      model: Item,
      attributes: ['name', 'price'],
    }],
    raw: true,
  })
      .then((res) => response.send(res))
      .catch((err) => {
        console.log('err', err);
        response.status(500).send(err);
      });
});


app.get('/cart/details/sum', (request, response) => {
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
      .then((items) => response.send(items))
      .catch((err) => response.status(500).send(err));
});


app.delete('/cart/purchase', (request, response) => {
  ShopCart.destroy({
    where: {},
    truncate: true,
  })
      .then(() => response.send({status: 'OK'}))
      .catch((err) => response.status(500).send({
        error: 'unable to deleted' + err}));
});
