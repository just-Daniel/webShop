const dac = require('../dac/image');

app.get('/image', (request, response) => {
  dac.getAllImages()
      .then((images) => response.send(images))
      .catch((err) => response.status(err.status).send(err.message));
});


app.post('/image', (request, response) => {
  const data = request.query;
  if (data.url) {
    dac.insertImage(data.url)
        .then((row) => response.send(row))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'URL images is required'});
  }
});

app.delete('/image', (request, response) => {
  const data = request.query;

  if (data.id) {
    dac.deleteImage(data.id)
        .then((res) => response.send(res))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(400).send({error: 'Id images is required'});
  }
});
