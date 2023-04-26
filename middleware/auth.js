const jsonwebtoken = require('jsonwebtoken');
const errorHandler = require('./errorHandler');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    errorHandler(error, req, res, next);
    // throw new UnauthorizedError('нет токена');
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'shhhhh');
    console.log(payload);
  } catch {
    errorHandler(error, req, res, next);
    // throw new UnauthorizedError('неверный токен');
  }

  req.user = payload;
  next();
}

module.exports = auth;
