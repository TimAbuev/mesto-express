const jsonwebtoken = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(400).send({ message: 'не авторизован 1' });
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'shhhhh');
    console.log(payload);
  } catch {
    res.status(400).send({ message: 'не авторизован 2' });
  }

  req.user = payload;
  next();
}

module.exports = auth;
