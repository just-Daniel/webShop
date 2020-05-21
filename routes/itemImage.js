const dac = require('../dac/itemImage');

app.post('/item/add-image', (request, response) => {
  const data = request.query;

  if (data.itemId && data.imageId) {
    dac.addImageToItem(data.itemId, data.imageId)
        .then((status) => response.send(status))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(500).send({error: 'rows are required'});
  }
});

app.delete('/item/remove-image', (request, response) => {
  const data = request.query;

  if (data.itemId && data.imageId) {
    dac.removeImageFromItem( data.itemId, data.imageId)
        .then((status) => response.send(status))
        .catch((err) => response.status(err.status).send(err.message));
  } else {
    response.status(500).send({error: 'rows are required'});
  }
});


