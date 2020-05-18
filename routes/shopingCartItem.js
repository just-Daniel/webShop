const ShopCart = require('../models/shopingCartItem');
const Item = require('../models/item');
const tokenUtils

app.post('/cart/add-item', (request, response) => {
  const data = request.query;

  Item.findByPk(data.id, {raw: true})
      .then((item) => {
        if (item) {
          console.log('item', item);
          console.log('item', item.name);
          ShopCart.create({
            name: item.name,
            price: item.price,
          }).then((res) => response.send(res))
              .catch((err) => response.status(500).send({
                error: 'Error add item to cart' + err}));
        } else {
          response.status(400).send({error: 'Id not found'});
        }
      })
      .catch((err) => response.status(400).send({error: 'Incorrect query' + err}));
});
