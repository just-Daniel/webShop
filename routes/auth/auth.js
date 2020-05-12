const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('config');
const tokenUtils = require('./token-utils');

app.use('*', (request, response, next) => {
  if (request.baseUrl === '/login' || request.baseUrl === '/register') {
    next();
  } else {
    tokenUtils.getUserToken(request)
        .then(() => next())
        .catch((err) => response.status(err.status).send(err.message));
  }
});

app.get('/user', (request, response) => {
  User.findAll().then((user) => {
    if (user) {
      response.send(user);
    } else {
      response.status(500).send(err);
    }
  });
});

app.post('/register', (request, response) => {
  const data = request.query;

  User.findOne({where: {name: data.name}}).then((user) => {
    if (user) {
      response.status(400).send({error: 'Username already exist'});
    } else {
      const hashPassword = crypto.createHash('sha256')
          .update(data.password).digest('hex');
      User.create({
        name: data.name,
        password: hashPassword,
      }).then((user) => {
        const privateKey = config.get('token-config');
        if (user) {
          const token = jwt.sign({id: user.id, password: hashPassword}, privateKey, {
            expiresIn: 86400,
          });
          response.send({auth: true, token: token});
        } else {
          response.status(500).send({error: 'Unable to save new user'});
        }
      });
    }
  });
});

app.post('/login', (request, response) => {
  const data = request.query;
  const hashPassword = crypto.createHash('sha256')
      .update(data.password).digest('hex');

  User.findOne({where: {
    name: data.name,
    password: hashPassword,
  }}).then((user) => {
    if (user) {
      const privateKey = config.get('token-config');
      const token = jwt.sign({id: user.id, password: hashPassword}, privateKey, {
        expiresIn: 86400,
      });
      response.send({auth: true, token: token});
    } else {
      response.status(400).send({error: 'Username or password incorrect'});
    }
  });
});

// app.put('/user', (request, response) => {
//   // const data = request.query;
//   // const hashPassword = crypto.createHash('sha256')
//   //     .update(data.password).digest('hex');


//   tokenUtils.getDecodedToken(request)
//       .then((decoded) => User.findOne({where: {
//         name: decoded.name,
//         password: decoded.password,
//       }}))
//       .then((user) => response.send(user))
//       .catch((err) => response.send(400, err));
// });


app.put('/user', (request, response) => {
  const data = request.query;

  if (data.password) {
    const hashPassword = crypto.createHash('sha256')
        .update(data.password).digest('hex');

    tokenUtils.getUserToken(request)
        .then((user) => {
          if (user) {
            console.log('hashPassword', hashPassword);
            User.update({password: hashPassword}, {
              where: {
                name: user.name,
              },
            }).then(() => {
              User.findOne({where: {
                name: user.name,
                password: hashPassword,
              }}).then((user) => {
                if (user) {
                  const privateKey = config.get('token-config');
                  const token = jwt.sign({id: user.id, password: hashPassword},
                      privateKey, {
                        expiresIn: 86400,
                      });
                  response.send({auth: true, token: token, user: user});
                } else {
                  response.status(400).send({error: 'Username or password incorrect'});
                }
              });
            })
                .catch((err) => response.status(500).send('Unable to update', err));
          } else {
            response.status(400).send({error: 'Incorrect token'});
          }
        }).catch((err) => response.status(500).send('Unable to update', err));
  } else {
    response.status(400).send({error: 'Password required'});
  }
});

