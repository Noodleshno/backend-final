const Joi = require("joi");

exports.registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string()
    .min(8)
    .required(),
});
