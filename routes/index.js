const router = require('express').Router();
// const { celebrate } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/usersControllers'); // важно соблюдать порядок импортируемых объектов
// const { signUserSchema } = require('../models/userSchema');

router.post('/signin', login);
router.post('/signup', createUser);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
