const Item = require('../models/item');

app.get('/item', (request, response) => {
  Item.findAll()
      .then((row) => response.send(row))
      .catch((err) => response.status(500).send(err));
});

app.post('/item', (request, response) => {
  const data = request.query;

  if (data.name && data.description && data.price && data.count &&
    data.rating && data.isEnabled && data.categoryId) {
    Item.create({
      name: data.name,
      description: data.description,
      price: data.price,
      count: data.count,
      rating: data.rating,
      isEnabled: data.isEnabled,
      categoryId: data.categoryId,
    }).then(() => response.send({status: 'OK'}))
        .catch((err) => response.status(500).send('Error created item' + err));
  } else {
    response.status(500).send({error: 'rows are required'});
  }
});
