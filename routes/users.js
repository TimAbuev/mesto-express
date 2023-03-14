const router = require('express').Router();
const { getUser, getUsers, createUser, refreshProfile } = require('../controllers/usersControllers'); //важно соблюдать порядок импортируемых объектов

//router.get('/users', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.get('/', getUsers);
//router.patch('./users/me/avatar', refreshAvatar);

module.exports = router;  