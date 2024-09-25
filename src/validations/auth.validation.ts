import Joi from 'joi';
import { password } from './custom.validation.js';

export const register = {
  body: Joi.object().keys({
    email_address: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    first_name: Joi.string().required(),
    mobile_no: Joi.string()
      .regex(/^[1-9][0-9]{7}$/)
      .messages({ 'string.pattern.base': 'Phone number must have 8 digits.' })
      .required()
  })
};

export const login = {
  body: Joi.object().keys({
    mobile_no: Joi.string()
      .regex(/^[1-9][0-9]{7}$/)
      .messages({ 'string.pattern.base': 'Phone number must have 8 digits.' })
      .required(),
    password: Joi.string().required().custom(password)
  })
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

export const forgotPassword = {
  body: Joi.object().keys({
    mobile_no: Joi.string()
      .regex(/^[1-9][0-9]{7}$/)
      .messages({ 'string.pattern.base': 'Phone number must have 8 digits.' })
      .required()
  })
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};

export const selectmember = {
  params: Joi.object().keys({
    submember_id: Joi.string().required()
  })
};
