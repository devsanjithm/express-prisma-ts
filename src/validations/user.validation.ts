import Joi from 'joi';
import { password } from './custom.validation.js';

export const create = {
  body: Joi.object().keys({
    email_address: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    first_name: Joi.string().required(),
    mobile_number: Joi.string().required()
  })
};

export const list = {
  body: Joi.object().keys({
    filter: Joi.object()
      .keys({
        is_active: Joi.boolean()
      })
      .required(),
    select: Joi.object().keys({
      first_name: Joi.boolean(),
      last_name: Joi.boolean(),
      email_address: Joi.boolean(),
      mobile_number: Joi.boolean(),
      roles: Joi.boolean(),
      isEmailVerified: Joi.boolean(),
      is_active: Joi.boolean(),
      user_id: Joi.boolean()
    }),
    options: Joi.object().keys({
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    }),
    include: Joi.object().keys({
      users: Joi.boolean()
    })
  })
};

export const get = {
  params: Joi.object().keys({
    user_id: Joi.string().required()
  })
};

export const update = {
  params: Joi.object().keys({
    user_id: Joi.string().required()
  }),
  body: Joi.object()
    .keys({
      mobile_no: Joi.string(),
      password: Joi.string(),
      email_address: Joi.string().email()
    })
    .min(1)
};

export const deleteData = {
  params: Joi.object().keys({
    user_id: Joi.string().required()
  })
};
