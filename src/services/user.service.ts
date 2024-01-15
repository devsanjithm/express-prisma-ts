import { users, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<users>}
 */
const createUser = async (
  email_address: string,
  password: string,
  first_name: string,
  roles: Role = Role.USER
): Promise<users> => {
  if (await getUserByEmail(email_address)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.users.create({
    data: {
      email_address,
      first_name,
      password: await encryptPassword(password),
      roles
    }
  });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof users>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'email_address',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<users, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const users = await prisma.users.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return users as Pick<users, Key>[];
};

/**
 * Get user by id
 * @param {UUID} user_id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<users, Key> | null>}
 */
const getUserById = async <Key extends keyof users>(
  user_id: string,
  keys: Key[] = [
    'user_id',
    'email_addres',
    'first_name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<users, Key> | null> => {
  return prisma.users.findUnique({
    where: { user_id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<users, Key> | null>;
};

/**
 * Get user by email
 * @param {string} email_address
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<users, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof users>(
  email_address: string,
  keys: Key[] = [
    'user_id',
    'email_address',
    'first_name',
    'last_name',
    'mobile_number',
    'password',
    'roles',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<users, Key> | null> => {
  return prisma.users.findUnique({
    where: { email_address },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<users, Key> | null>;
};

/**
 * Update user by id
 * @param {UUID} user_id
 * @param {Object} updateBody
 * @returns {Promise<users>}
 */
const updateUserById = async <Key extends keyof users>(
  user_id: string,
  updateBody: Prisma.usersUpdateInput,
  keys: Key[] = ['user_id', 'email_address', 'first_name', 'role'] as Key[]
): Promise<Pick<users, Key> | null> => {
  const user = await getUserById(user_id, ['user_id', 'email_address', 'first_name']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email_address && (await getUserByEmail(updateBody.email_address as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const updatedUser = await prisma.users.update({
    where: { user_id: user.user_id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<users, Key> | null;
};

/**
 * Delete user by id
 * @param {UUID} userId
 * @returns {Promise<users>}
 */
const deleteUserById = async (userId: string): Promise<users> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.users.delete({ where: { user_id: user.user_id } });
  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};
