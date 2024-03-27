import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    EMAIL_ACTIVE: Joi.boolean().description('Email SMTP toggler'),
    FILE_UPLOAD: Joi.boolean().description('Toggler for file upload'),
    AWS_BUCKETNAME: Joi.string().description('AWS bucket Name'),
    AWS_BUCKETREGION: Joi.string().description('AWS Bucket region'),
    AWS_BUCKET_ACCESS_KEY: Joi.string().description('AWS Bucket Access Key'),
    AWS_BUCKET_SECRET_KEY: Joi.string().description('AWS Bucket Secret key'),
    REDIS_URL: Joi.string().description('Redis Url')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  features: {
    file: envVars.FILE_UPLOAD,
    email_SMTP: envVars.EMAIL_ACTIVE
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  },
  aws: {
    bucketName: envVars.AWS_BUCKETNAME,
    bucketRegion: envVars.AWS_BUCKETREGION,
    bucketAccessKey: envVars.AWS_BUCKET_ACCESS_KEY,
    bucketSecretKey: envVars.AWS_BUCKET_SECRET_KEY
  },
  redis: {
    url: envVars.REDIS_URL
  },
  bullmq: {
    connector: {
      host: 'localhost',
      port: 6379
    },
    DEFAULT_REMOVE_CONFIG: {
      removeOnComplete: {
        age: 3600
      },
      removeOnFail: {
        age: 24 * 3600
      }
    }
  }
};
