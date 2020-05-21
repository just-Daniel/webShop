const Category = require('../models/category');
const ResponseError = require('../routes/auth/response-error');

const getAllCategories = () => {
  const promise = new Promise((resolve, reject) => {
    Category.findAll({hierarchy: true})
        .then((row) => resolve(row))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const getAllRootCategories = () => {
  const promise = new Promise((resolve, reject) => {
    Category.findAll({
      where: {hierarchyLevel: 1},
    }).then((row) => resolve(row))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};


const insertCategory = (name, parentId) => {
  const promise = new Promise((resolve, reject) => {
    Category.create({
      name: name,
      parentId: parentId,
    }).then((row) => resolve(row))
        .catch((err) => reject(new ResponseError(err, 500)));
  });
  return promise;
};

const updateCategory = (id, name) => {
  const promise = new Promise((resolve, reject) => {
    Category.findByPk(id)
        .then((category) => {
          if (category) {
            Category.update({name: name}, {
              where: {id: category.id},
            }).then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(err, 500)));
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })

        .catch((err) => reject(new ResponseError('Id is incorrect' + err, 400)));
  });
  return promise;
};


const deleteCategory = (id) => {
  const promise = new Promise((resolve, reject) => {
    Category.findByPk(id)
        .then((category) => {
          if (category) {
            Category.destroy({where: {id: category.id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(err, 500)));
          } else {
            reject(new ResponseError('Id not found', 404));
          }
        })
        .catch((err) => reject(new ResponseError('Id is incorrect' + err, 400)));
  });
  return promise;
};


module.exports.getAllCategories = getAllCategories;
module.exports.getAllRootCategories = getAllRootCategories;
module.exports.insertCategory = insertCategory;
module.exports.updateCategory = updateCategory;
module.exports.deleteCategory = deleteCategory;
