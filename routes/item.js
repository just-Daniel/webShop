const Item = require('../models/item');

app.get('/item', (request, response) => {
  Item.findAll()
      .then((row) => response.send(row))
      .catch((err) => response.status(500).send(err));
});

app.post('/item', (request, response) => {
  const data = request.query;

  if (data.name && data.description && data.price && data.count &&
    data.rating && data.categoryId) {
    Item.create({
      name: data.name,
      description: data.description,
      price: data.price,
      count: data.count,
      rating: data.rating,
      categoryId: data.categoryId,
    }).then(() => response.send({status: 'OK'}))
        .catch((err) => response.status(500).send('Error created item ' + err));
  } else {
    response.status(500).send({error: 'rows are required'});
  }
});


app.put('/item', (request, response) => {
  const data = request.query;

  if (data.id) {
    Item.findByPk(data.id)
        .then((item) => {
          if (item) {
            Item.update({
              name: data.name,
              description: data.description,
              price: data.price,
              count: data.count,
              rating: data.rating,
            }, {where: {id: item.id}}).then(() => response.send({status: 'OK'}))
                .catch((err) => response.status(500).send('Error updated item ' + err));
          } else {
            response.status(400).send({error: 'Id not found'});
          }
        })
        .catch((err) => response.status(400).send({error: 'Id is incorrect ' + err}));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});

app.put('/item/admin', (request, response) => {
  const data = request.query;

  if (data.id) {
    Item.findByPk(data.id)
        .then((item) => {
          if (item) {
            Item.update({
              isEnabled: data.isEnabled,
            }, {where: {id: item.id}}).then(() => response.send({status: 'OK'}))
                .catch((err) => response.status(500).send('Error updated item ' + err));
          } else {
            response.status(400).send({error: 'Id not found'});
          }
        })
        .catch((err) => response.status(400).send({error: 'Id is incorrect ' + err}));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});


app.delete('/item', (request, response) => {
  const data = request.query;

  if (data.id) {
    Item.findByPk(data.id)
        .then((item) => {
          if (item) {
            Item.destroy({where: {id: item.id}})
                .then(()=> response.send({status: 'OK'}))
                .catch((err) => response.status(500).send({
                  error: 'Error deleted item' + err}));
          } else {
            response.status(400).send({error: 'Id not found'});
          }
        })
        .catch((err) => response.status(400).send({error: 'Id is incorrect ' + err}));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});

