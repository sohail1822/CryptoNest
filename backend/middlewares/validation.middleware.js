import Joi from "joi";

const schemas = {
  signup: Joi.object({
    first_name: Joi.string().min(2).max(50).required().trim(),
    last_name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
    phone: Joi.number().required(),
    address: Joi.string().min(5).max(200).required().trim(),
  }).unknown(false),

  login: Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required(),
  }).unknown(false),

  buyCrypto: Joi.object({
    userId: Joi.string().required(),
    stockId: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    current_price: Joi.number().positive().required(),
  }).unknown(false),

  sellCrypto: Joi.object({
    userId: Joi.string().required(),
    stockId: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    current_price: Joi.number().positive().required(),
  }).unknown(false),

  addToWatchlist: Joi.object({
    coinId: Joi.string().required(),
    coinSymbol: Joi.string().optional(),
  }).unknown(false),

  removeFromWatchlist: Joi.object({
    coinId: Joi.string().required(),
  }).unknown(false),
};

// Validation middleware factory
export const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return next();
    }

    const { error, value } = schema.validate(req.body);

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");

      return res.status(400).json({
        success: false,
        message: `Validation error: ${message}`,
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

export default validate;
