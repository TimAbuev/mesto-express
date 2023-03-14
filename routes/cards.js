const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cardsControllers'); //важно соблюдать порядок импортируемых объектов

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);

module.exports = router;  