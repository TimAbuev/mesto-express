const { BAD_REQUEST } = require('../errors/statusCodes');

function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (password.length < 8) {
    return res.status(BAD_REQUEST).send({ message: 'Длина пароля должна быть не менее 8 символов' });
  }
  return next();
}

module.exports = checkPasswordLength;
