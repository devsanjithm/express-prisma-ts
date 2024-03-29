import Joi from 'joi';
import { password } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email_address: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required()
  })
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUser = {
  params: Joi.object().keys({
    user_id: Joi.number().integer()
  })
};

const updateUser = {
  params: Joi.object().keys({
    user_id: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      email_address: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string()
    })
    .min(1)
};

const deleteUser = {
  params: Joi.object().keys({
    user_id: Joi.string()
  })
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
