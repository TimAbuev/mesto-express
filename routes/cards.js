const router = require('express').Router();
const { getCards, createCard, deleteCard, addLike } = require('../controllers/cardsControllers'); //важно соблюдать порядок импортируемых объектов

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike)

module.exports = router;  