const Image = require('../models/image');
const ResponseError = require('../routes/auth/response-error');

const getAllImages = () => {
  const promise = new Promise((resolve, reject) => {
    Image.findAll()
        .then((images) => resolve(images))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};

const insertImage = (url) => {
  const promise = new Promise((resolve, reject) => {
    Image.create({url: url})
        .then((row) => resolve(row))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const deleteImage = (id) => {
  const promise = new Promise((resolve, reject) => {
    Image.findByPk(id)
        .then((image) => {
          if (image) {
            Image.destroy({where: {id: image.id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(
                    'Unable to delete image' + err, 500)));
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Id is incorrect', 400)));
  });
  return promise;
};

module.exports = {
  getAllImages, insertImage, deleteImage,
};
