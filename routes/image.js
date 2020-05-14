const Image = require('../models/image');

app.get('/image', (request, response) => {
  Image.findAll()
      .then((images) => response.send(images))
      .catch((err) => response.send(err));
});


app.post('/image', (request, response) => {
  const data = request.query;
  if (data.url) {
    Image.create({url: data.url})
        .then((row) => response.send(row))
        .catch((err) => response.status(500).send(err));
  } else {
    response.status(400).send({error: 'URL images is required'});
  }
});

app.delete('/image', (request, response) => {
  const data = request.query;

  if (data.id) {
    Image.findByPk(data.id)
        .then((image) => {
          if (image) {
            Image.destroy({where: {id: image.id}})
                .then(() => response.send({status: 'OK'}))
                .catch((err) => response.status(500).send(
                    'Unable to delete image' + err));
          } else {
            response.status(400).send({error: 'Id not found'});
          }
        })
        .catch((err) => response.status(400).send({error: 'Id is incorrect' + err}));
  } else {
    response.status(400).send({error: 'Id images is required'});
  }
});
