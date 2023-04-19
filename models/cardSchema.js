const mongoose = require('mongoose');
const Joi = require('joi');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = {
  cardSchema: mongoose.model('card', cardSchema),
  postSchema: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
  paramSchema: Joi.object({
    cardId: Joi.string().required().hex().length(24),
  }),
};
