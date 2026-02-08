const Joi = require("joi");

exports.reviewSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required(),

  content: Joi.string()
    .min(10)
    .required(),

  rating: Joi.number()
    .min(1)
    .max(5)
    .required(),

  game: Joi.string()
    .min(2)
    .required(),
});