import { userService } from '../services/user.service.js';
import { controller } from '../lib/controller/controller.js';

export const userController = controller(userService as any);
