const Item = require('../models/item');

app.get('/item', (request, response) => {
  Item.findAll({hierarchy: true})
      .then((row) => response.send(row))
      .catch((err) => response.status(500).send(err));
});

app.post('/item', (request, response) => {
  const data = request.query;
  Item.create({
    name: data.name,
    category: data.category,
    image: data.image,
    description: data.description,
    price: data.price,
    count: data.count,
    rating: data.rating,
    isEnabled: data.isEnabled,
  }).then(() => response.status(200).send('OK'))
      .catch((err) => response.status(400).send('Error created item'));
});
