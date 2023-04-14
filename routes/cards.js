const router = require('express').Router();
const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cardsControllers'); // важно соблюдать порядок импортируемых объектов
const auth = require('../middleware/auth');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, addLike);
router.delete('/:cardId/likes', auth, removeLike);

module.exports = router;
