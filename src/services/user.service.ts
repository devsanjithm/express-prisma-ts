import { service } from '../lib/services/service.js';

export const userService = service<'users'>('users');

// Example for creating custom get

// const customget = (where: any): any => {
//   console.log(where);
//   return true;
// };

// userService.get = customget;
