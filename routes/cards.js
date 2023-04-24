const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cardsControllers'); // важно соблюдать порядок импортируемых объектов
const auth = require('../middleware/auth');
const { postSchema, paramSchema } = require('../models/cardSchema');

router.get('/', auth, getCards);
router.post('/', auth, celebrate({ body: postSchema }), createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, celebrate({ params: paramSchema }), addLike);
router.delete('/:cardId/likes', auth, celebrate({ params: paramSchema }), removeLike);

module.exports = router;
