const Image = require('../models/image');

app.get('/image', (request, response) => {
  Image.findAll()
      .then((images) => response.send(images))
      .catch((err) => response.send(err));
});
