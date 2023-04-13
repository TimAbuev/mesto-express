const router = require('express').Router();
const {
  getUser, getUsers, createUser, refreshProfile, refreshAvatar, login, getCurrentuser,
} = require('../controllers/usersControllers'); // важно соблюдать порядок импортируемых объектов
const auth = require('../middleware/auth');

router.get('/me', auth, getCurrentuser);
router.get('/:userId', auth, getUser);
router.get('/', getUsers);
router.patch('/me', refreshProfile);
router.patch('/me/avatar', refreshAvatar);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
