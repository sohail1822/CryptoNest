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
    stockId: Joi.string().trim().min(1).max(100).required(),
    quantity: Joi.number().positive().required(),
  }).unknown(false),

  sellCrypto: Joi.object({
    stockId: Joi.string().trim().min(1).max(100).required(),
    quantity: Joi.number().positive().required(),
  }).unknown(false),

  addToWatchlist: Joi.object({
    coinId: Joi.string().trim().min(1).max(100).required(),
    coinSymbol: Joi.string().trim().max(20).optional(),
  }).unknown(false),

  removeFromWatchlist: Joi.object({
    coinId: Joi.string().trim().min(1).max(100).required(),
  }).unknown(false),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(6)
      .max(128)
      .invalid(Joi.ref("currentPassword"))
      .required()
      .messages({
        "any.invalid": "New password must be different from the current password",
      }),
  }).unknown(false),

  updateSubscription: Joi.object({
    tier: Joi.string().valid("basic", "pro", "elite").required(),
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
