import Joi from "joi";

export const UserValidationSchema = Joi.object({
  channelName: Joi.string().max(40).required().messages({
    "any.required": "ChannelName is Required ",
    "string.max": "ChannelName can not be longer than {#limit} characters",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.email": "Enter a valid email address",
    }),
  password: Joi.string().min(6).max(20).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least {#limit} characters long",
    "string.max": "Password cannot be longer than {#limit} characters",
  }),
});

export const LoginSchemaValidation = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.email": "Enter a valid email address",
    }),
  password: Joi.string().min(6).max(20).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least {#limit} characters long",
    "string.max": "Password cannot be longer than {#limit} characters",
  }),
});
