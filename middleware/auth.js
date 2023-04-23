const jsonwebtoken = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('нет токена');
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'shhhhh');
    console.log(payload);
  } catch {
    throw new UnauthorizedError('неверный токен');
  }

  req.user = payload;
  next();
}

module.exports = auth;
