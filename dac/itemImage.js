const Item = require('../models/item');
const Image = require('../models/image');
const ResponseError = require('../routes/auth/response-error');

const addImageToItem = (itemId, imageId) => {
  const promise = new Promise((resolve, reject) => {
    Item.findOne({where: {id: itemId}})
        .then((item) => {
          if (item) {
            Image.findOne({where: {id: imageId}})
                .then((image) => {
                  if (image) {
                    item.addImage(image)
                        .then(() => resolve({status: 'OK'}))
                        .catch((err) => reject(new ResponseError(err, 500)));
                  } else {
                    reject(new ResponseError('Image not found', 400));
                  }
                })
                .catch((err) => reject(new ResponseError(
                    'Id image is incorrect ' + err, 400)));
          } else {
            reject(new ResponseError('Item not found', 400));
          }
        })
        .catch((err) => reject(new ResponseError('Id item is incorrect ' + err, 400)));
  });
  return promise;
};


const removeImageFromItem = (itemId, imageId) => {
  const promise = new Promise((resolve, reject) => {
    Item.findOne({where: {id: itemId}})
        .then((item) => {
          if (item) {
            item.getImages()
                .then((images) => {
                  for (image of images) {
                    if (image.id == imageId) {
                      image.ItemImages.destroy()
                          .then(() => resolve({status: 'OK'}))
                          .catch((err) => reject(new ResponseError(err, 500)));
                    } else {
                      reject(new ResponseError(err, 400));
                    }
                  }
                })
                .catch((err) => reject(new ResponseError('Images ' + err, 500)));
          } else {
            reject(new ResponseError('Item not found', 400));
          }
        })
        .catch((err) => reject(new ResponseError('Id item is incorrect ' + err, 400)));
  });
  return promise;
};

module.exports.addImageToItem = addImageToItem;
module.exports.removeImageFromItem = removeImageFromItem;
