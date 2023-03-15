const router = require('express').Router();
const { getUser, getUsers, createUser, refreshProfile } = require('../controllers/usersControllers'); //важно соблюдать порядок импортируемых объектов

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', refreshProfile);
//router.patch('./users/me/avatar', refreshAvatar);

module.exports = router;  