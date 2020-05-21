const dac = require('../dac/item');

app.get('/item', (request, response) => {
  dac.getAllItems()
      .then((items) => response.send(items))
      .catch((err) => response.status(err.status).send(err.message));
});

app.post('/item', (request, response) => {
  const data = request.query;

  if (data.name && data.description && data.price && data.count &&
    data.rating && data.categoryId) {
    dac.insertItem(data.name, data.description, data.price,
        data.count, data.rating, data.categoryId)
        .then((item) => response.send(item))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(500).send({error: 'rows are required'});
  }
});


app.put('/item', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.updateItem(data.id, data.name, data.description,
        data.price, data.count, data.rating)
        .then((item) => response.send(item))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});

app.put('/item/admin', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.accessEnableItem(data.id, data.isEnabled)
        .then((status) => response.send(status))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});


app.delete('/item', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.deleteItem(data.id)
        .then((status)=> response.send(status))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});

