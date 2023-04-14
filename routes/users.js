const router = require('express').Router();
const {
  getUser, getUsers, createUser, refreshProfile, refreshAvatar, login, getCurrentUser,
} = require('../controllers/usersControllers'); // важно соблюдать порядок импортируемых объектов
const auth = require('../middleware/auth');

router.get('/me', getCurrentUser);
router.get('/:userId', auth, getUser);
router.get('/', auth, getUsers);
router.patch('/me', auth, refreshProfile);
router.patch('/me/avatar', auth, refreshAvatar);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
