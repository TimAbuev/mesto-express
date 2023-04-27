const jsonwebtoken = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    next(new UnauthorizedError('нет токена'));
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'shhhhh');
    console.log(payload);
  } catch {
    next(new UnauthorizedError('неверный токен'));
  }

  req.user = payload;
  next();
}

module.exports = auth;
