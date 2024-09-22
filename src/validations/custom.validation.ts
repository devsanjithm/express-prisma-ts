import type Joi from 'joi';

export const password: Joi.CustomValidator<string> = (value, helpers) => {
  if (value.length < 8) {
    return helpers.error('password must be at least 8 characters');
  }

  if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
    return helpers.error('password must contain at least 1 letter and 1 number');
  }

  return value;
};
