const Image = sequelize.define('image', {
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Image;
