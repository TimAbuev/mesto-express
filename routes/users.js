const router = require('express').Router();
const { getUser, getUsers, createUser } = require('../controllers/usersControllers'); //важно соблюдать порядок импортируемых объектов

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);

module.exports = router;  