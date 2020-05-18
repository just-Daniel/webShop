const Item = require('../models/item');
const Image = require('../models/image');

app.post('/item/add-image', (request, response) => {
  const data = request.query;

  if (data.item_id && data.image_id) {
    Item.findOne({where: {id: data.item_id}})
        .then((item) => {
          if (item) {
            Image.findOne({where: {id: data.image_id}})
                .then((image) => {
                  if (image) {
                    item.addImage(image)
                        .then(() => response.send({status: 'OK'}))
                        .catch((err) => response.status(500).send(err));
                  } else {
                    response.status(400).send({error: 'image not found'});
                  }
                })
                .catch((err) => response.status(400).send({
                  error: 'Id image is incorrect ' + err}));
          } else {
            response.status(400).send({error: 'item not found'});
          }
        })
        .catch((err) => response.status(400).send({
          error: 'Id item is incorrect ' + err}));
  } else {
    response.status(500).send({error: 'rows are required'});
  }
});

app.delete('/item/remove-image', (request, response) => {
  const data = request.query;

  if (data.item_id && data.image_id) {
    Item.findOne({where: {id: data.item_id}})
        .then((item) => {
          if (item) {
            item.getImages()
                .then((images) => {
                  for (image of images) {
                    if (image.id == data.image_id) {
                      image.ItemImages.destroy()
                          .then(() => response.send({status: 'OK'}))
                          .catch((err) => response.status(500).send(err));
                    } else {
                      response.status(400).send(err);
                    }
                  }
                })
                .catch((err) => response.status(500).send(err));
          } else {
            response.status(400).send({error: 'item not found'});
          }
        })
        .catch((err) => response.status(400).send({
          error: 'Id item is incorrect ' + err}));
  } else {
    response.status(500).send({error: 'rows are required'});
  }
});


