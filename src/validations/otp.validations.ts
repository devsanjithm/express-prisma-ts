import Joi from 'joi';

export const sendOtp = {
  body: Joi.object().keys({
    mobile_no: Joi.string()
      .regex(/^[1-9][0-9]{7}$/)
      .messages({ 'string.pattern.base': 'Phone number must have 8 digits.' })
      .required()
  })
};

export const verifyOtp = {
  body: Joi.object().keys({
    mobile_no: Joi.string()
      .regex(/^[1-9][0-9]{7}$/)
      .messages({ 'string.pattern.base': 'Phone number must have 8 digits.' })
      .required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
      'string.length': 'OTP must be exactly 6 characters long',
      'string.pattern.base': 'OTP must only contain numbers (0-9)'
    })
  })
};
