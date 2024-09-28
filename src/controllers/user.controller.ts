import { userService } from '../services/user.service.js';
import { controller } from '../lib/controller/controller.js';

const CRUDController = controller(userService);
const customController = {};

export const userController = { ...CRUDController, ...customController };
