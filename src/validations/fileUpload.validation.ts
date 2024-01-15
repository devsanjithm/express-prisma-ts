import Joi from 'joi';

const fileUpload = {
  file: Joi.any().required()
};

export default {
  fileUpload
};
