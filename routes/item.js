const Item = require('../models/item');

app.get('/item', (request, response) => {
  res.send('Hello World');
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
