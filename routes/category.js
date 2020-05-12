const Category = require('../models/category');

app.get('/category', (request, response) => {
  Category.findAll({hierarchy: true})
      .then((row) => response.send(row))
      .catch((err) => response.status(500).send(err));
});

app.post('/category', (request, response) => {
  const data = request.query;
  Category.create({
    name: data.name,
    parentId: data.parentId,
  }).then((row) => response.send(row))
      .catch((err) => response.status(500).send(err));
});
