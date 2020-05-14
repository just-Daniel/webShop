const Category = require('../models/category');

app.get('/category', (request, response) => {
  Category.findAll({hierarchy: true})
      .then((row) => response.send(row))
      .catch((err) => response.status(500).send(err));
});


app.get('/category/root', (request, response) => {
  Category.findAll({
    where: {hierarchyLevel: 1},
    // include: [{model: Category, as: 'ancestors'}]
  }).then((row) => response.send(row))
      .catch((err) => response.status(500).send(err));
});


app.post('/category', (request, response) => {
  const data = request.query;
  if (data.name) {
    Category.create({
      name: data.name,
      parentId: data.parentId,
    }).then((row) => response.send(row))
        .catch((err) => response.status(500).send(err));
  } else {
    response.status(400).send({error: 'name is required'});
  }
});


app.put('/category', (request, response) => {
  const data = request.query;

  if (data.id && data.name) {
    Category.findByPk(data.id)
        .then((category) => {
          if (category) {
            Category.update({name: data.name}, {
              where: {
                id: category.id,
              },
            }).then(() => response.send({status: 'OK'}))
                .catch((err) => response.status(500).send(err));
          } else {
            response.status(400).send({error: 'Id not found'});
          }
        })
        .catch((err) => response.status(400).send({error: 'Id is incorrect' + err}));
  } else {
    response.status(400).send({error: 'Id and name required'});
  }
});


app.delete('/category', (request, response) => {
  const data = request.query;

  if (data.id) {
    Category.findByPk(data.id)
        .then((category) => {
          if (category) {
            Category.destroy({where: {id: category.id}})
                .then(() => response.send({status: 'OK'}))
                .catch((err) => response.status(500).send(
                    'Unable to delete category' + err));
          } else {
            response.status(400).send({error: 'Id not found'});
          }
        })
        .catch((err) => response.status(400).send({error: 'Id is incorrect' + err}));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});
