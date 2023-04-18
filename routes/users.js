const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUser, getUsers, createUser, refreshProfile, refreshAvatar, login, getCurrentUser,
} = require('../controllers/usersControllers'); // важно соблюдать порядок импортируемых объектов
const auth = require('../middleware/auth');
const { signUserSchema, profileUserSchema, avatarUserSchema } = require('../models/userSchema');

router.get('/me', getCurrentUser);
router.get('/:userId', auth, getUser);
router.get('/', auth, getUsers);
router.patch('/me', auth, celebrate({ body: profileUserSchema }), refreshProfile);
router.patch('/me/avatar', auth, celebrate({ body: avatarUserSchema }), refreshAvatar);
router.post('/signin', celebrate({ body: signUserSchema }), login);
router.post('/signup', celebrate({ body: signUserSchema }), createUser);

module.exports = router;
