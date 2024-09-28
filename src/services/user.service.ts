import { service } from '../lib/services/service.js';
// Example for creating custom get

// const customget = (where: any): any => {
//   console.log(where);
//   return true;
// };

// userService.get = customget;

const customServices = {};
const CRUDServices = service<'users'>('users');

export const userService = { ...customServices, ...CRUDServices };
