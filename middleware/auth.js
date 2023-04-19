const jsonwebtoken = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError();
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'shhhhh');
    console.log(payload);
  } catch {
    throw new UnauthorizedError();
  }

  req.user = payload;
  next();
}

module.exports = auth;
