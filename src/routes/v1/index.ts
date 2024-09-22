import express from 'express';
import config from '../../config/config.js';
// import authRoute from './auth.route.js';
import cronRoute from './cron.route.js';
import docsRoute from './docs.route.js';
import fileRoute from './fileUpload.route.js';
import otpRoute from './otp.route.js';
import userRoute from './user.route.js';

const router = express.Router();

const defaultRoutes = [
  // {
  //   path: '/auth',
  //   route: authRoute
  // },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/cron',
    route: cronRoute
  },
  {
    path: '/otp',
    route: otpRoute
  }
];

const fileRoutes = [
  {
    path: '/file',
    route: fileRoute
  }
];

const developmentRoutes = [
  // Routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

for (const route of defaultRoutes) {
  router.use(route.path, route.route);
}

/* istanbul ignore next */
if (config.env === 'development') {
  for (const route of developmentRoutes) {
    router.use(route.path, route.route);
  }
}

if (config.features.file) {
  for (const route of fileRoutes) {
    router.use(route.path, route.route);
  }
}

export default router;
