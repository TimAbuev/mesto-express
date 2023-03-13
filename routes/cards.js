const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cardsControllers'); //важно соблюдать порядок импортируемых объектов

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;  