const dac = require('../dac/category');

app.get('/category', (request, response) => {
  dac.getAllCategories()
      .then((res) => response.send(res))
      .catch((err) => response.status(err.status).send(err.message));
});


app.get('/category/root', (request, response) => {
  dac.getAllRootCategories()
      .then((res) => response.send(res))
      .catch((err) => response.status(err.status).send(err.message));
});


app.post('/category', (request, response) => {
  const data = request.query;
  if (data.name) {
    dac.insertCategory(data.name, data.parentId)
        .then((row) => response.send(row))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'name is required'});
  }
});


app.put('/category', (request, response) => {
  const data = request.query;

  if (data.id && data.name) {
    dac.updateCategory(data.id, data.name)
        .then((res) => response.send(res))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id and name required'});
  }
});


app.delete('/category', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.deleteCategory(data.id)
        .then((res) => response.send(res))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id is required'});
  }
});
