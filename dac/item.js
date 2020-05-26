const Item = require('../models/item');
const ResponseError = require('../routes/auth/response-error');

const getAllItems = () => {
  const promise = new Promise((resolve, reject) => {
    Item.findAll()
        .then((items) => resolve(items))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};

const insertItem = (name, description, price, count, rating, categoryId) => {
  const promise = new Promise((resolve, reject) => {
    Item.create({
      name: name,
      description: description,
      price: price,
      count: count,
      rating: rating,
      categoryId: categoryId,
    }).then((item) => resolve(item))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const updateItem = (id, name, description, price, count, rating) => {
  const promise = new Promise((resolve, reject) => {
    Item.findByPk(id)
        .then((item) => {
          if (item) {
            Item.update({
              name: name,
              description: description,
              price: price,
              count: count,
              rating: rating,
            }, {where: {id: item.id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(err, 500)));
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Id is incorrect ' + err, 400)));
  });
  return promise;
};


const accessEnableItem = (id, isEnabled) => {
  const promise = new Promise((resolve, reject) => {
    Item.findByPk(id)
        .then((item) => {
          if (item) {
            Item.update({
              isEnabled: isEnabled,
            }, {where: {id: item.id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(err, 500)));
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Id is incorrect ' + err, 400)));
  });
  return promise;
};


const deleteItem = (id) => {
  const promise = new Promise((resolve, reject) => {
    Item.findByPk(id)
        .then((item) => {
          if (item) {
            Item.destroy({where: {id: item.id}})
                .then(()=> resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(err, 500)));
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Id is incorrect ' + err, 400)));
  });
  return promise;
};

module.exports = {
  getAllItems, insertItem, updateItem, accessEnableItem, deleteItem,
};
