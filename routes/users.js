const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUser, getUsers, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/usersControllers'); // важно соблюдать порядок импортируемых объектов
const auth = require('../middleware/auth');
const { profileUserSchema, avatarUserSchema } = require('../models/userSchema');

router.get('/me', auth, getCurrentUser);
router.get('/:userId', auth, getUser);
router.get('/', auth, getUsers);
router.patch('/me', auth, celebrate({ body: profileUserSchema }), updateProfile);
router.patch('/me/avatar', auth, celebrate({ body: avatarUserSchema }), updateAvatar);

module.exports = router;
