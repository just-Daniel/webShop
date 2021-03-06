const dac = require('../dac/shopingCartItem');

app.post('/cart/add-item', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.addItem(data.id, request)
        .then((item) => response.send(item))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});


app.delete('/cart/remove-item', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.removeItem(data.id)
        .then((item) => response.send(item))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});


app.put('/cart/add-one-more-item', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.addOneOrMoreItems(data.id, data.addItem, request)
        .then((item) => response.send(item))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});


app.put('/cart/remove-one-more-item', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.removeOneOrMoreItems(data.id, data.subtractItem)
        .then((item) => response.send(item))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});


app.get('/cart', (request, response) => {
  dac.getAllItems()
      .then((items) => response.send(items))
      .catch((err) => response.status(err.status).send(err.message));
});


app.get('/cart/details/counts', (request, response) => {
  dac.getCountsItems()
      .then((item) => response.send(item))
      .catch((err) => response.status(err.status).send(err.message));
});


app.get('/cart/details/item-price', (request, response) => {
  dac.getItemAndPrice()
      .then((items) => response.send(items))
      .catch((err) => response.status(err.status).send(err.message));
});


app.get('/cart/details/sum', (request, response) => {
  dac.getOverallPriceItems()
      .then((items) => response.send(items))
      .catch((err) => response.status(err.status).send(err.message));
});


app.delete('/cart/purchase', (request, response) => {
  dac.purchaseItems()
      .then((items) => response.send(items))
      .catch((err) => response.status(err.status).send(err.message));
});
