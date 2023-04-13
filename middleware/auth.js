const jsonwebtoken = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../controllers/errors');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'необходима авторизация' });
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'shhhhh');
  } catch {
    res.status(UNAUTHORIZED).send({ message: 'необходима авторизация' });
  }

  req.user = payload;
  next();
}

module.exports = auth;
