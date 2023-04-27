const router = require('express').Router();
const { celebrate } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/usersControllers'); // важно соблюдать порядок импортируемых объектов
const { signUserSchema } = require('../models/userSchema');
const checkPassword = require('../middleware/checkPasswordLength');

router.post('/signin', celebrate({ body: signUserSchema }), login);
router.post('/signup', celebrate({ body: signUserSchema }), checkPassword, createUser);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
