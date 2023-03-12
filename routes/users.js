const router = require('express').Router();
const { getUser, getUsers, createUser } = require('../controllers/usersControllers'); //важно соблюдать порядок импортируемых объектов

router.get('/', getUsers);
router.get('/:iddd', getUser);
router.post('/', createUser);

module.exports = router;  