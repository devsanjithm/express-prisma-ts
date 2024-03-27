import { users, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

/**
 * Create a user
 * @param {string} email_address
 * @param {string} password
 * @param {string} username
 * @returns {Promise<users>}
 */
const createUser = async (
  email_address: string,
  password: string,
  username: string
): Promise<users> => {
  if (await getUserByEmail(email_address)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.users.create({
    data: {
      email_address,
      first_name: username,
      password: await encryptPassword(password),
      roles: Role.USER
    }
  });
};

/**
 * Query for users
 * @param {Prisma.usersWhereInput} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {Prisma.usersSelect} select - select fields
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof users>(
  filter: Prisma.usersWhereInput,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  select: Prisma.usersSelect
): Promise<Pick<users, Key>[]> => {
  const page = options.page ?? 0;
  const limit = options.limit ?? Number.MAX_SAFE_INTEGER;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const payload: Prisma.usersFindManyArgs = {
    where: filter,
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  };
  if (select) {
    payload['select'] = select;
  }
  const users = await prisma.users.findMany(payload);
  return users as Pick<users, Key>[];
};

/**
 * Get user by id
 * @param {UUID} user_id
 * @param {Array<Key>} keys
 * @returns {Promise<users | null>}
 */

const getUserById = async <Key extends keyof Prisma.usersSelect>(
  user_id: string,
  keys: Key[] = Object.keys(prisma.users.fields) as Key[]
): Promise<users | null> => {
  return prisma.users.findUnique({
    where: { user_id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<users | null>;
};

/**
 * Get user by email
 * @param {string} email_address
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<users, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof users>(
  email_address: string,
  keys: Key[] = Object.keys(prisma.users.fields) as Key[]
): Promise<Pick<users, Key> | null> => {
  return prisma.users.findUnique({
    where: { email_address },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<users, Key> | null>;
};

/**
 * Update user by id
 * @param {UUID} user_id
 * @param {Primsa.usersUpdateInput} updateBody
 * @returns {Promise<users>}
 */
const updateUserById = async <Key extends keyof users>(
  user_id: string,
  updateBody: Prisma.usersUpdateInput,
  keys: Key[] = Object.keys(prisma.users.fields) as Key[]
): Promise<Pick<users, Key> | null> => {
  const user = await getUserById(user_id, ['user_id', 'email_address']);
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
 * @param {UUID} user_id
 * @returns {Promise<users>}
 */
const deleteUserById = async (user_id: string): Promise<users> => {
  const user = await getUserById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.users.softDelete({ user_id: user.user_id });
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
