import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import responseHandler from '../utils/response';
import exclude from '../utils/exclude';

const createUser = catchAsync(async (req, res) => {
  const { email_address, password, username } = req.body;
  console.log(email_address, password, username);
  const user = await userService.createUser(email_address, password, username);
  responseHandler(res, user, httpStatus.CREATED);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const select = req.body.select;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options, select);
  responseHandler(res, result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  responseHandler(res, user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  const responseUser = user ? exclude(user, ['password']) : user;
  responseHandler(res, responseUser);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.user_id);
  responseHandler(res, null);
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
