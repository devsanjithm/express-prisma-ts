import { Response } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { ResponseObject } from '../types/response';

const responseHandler = (
  res: Response<any, Record<string, any>, number>,
  obj?: object | null,
  status?: number
) => {
  const responseObject: ResponseObject = {
    status: true
  };
  if (obj) responseObject['data'] = obj;
  return res.status(status ?? httpStatus.OK).send(responseObject);
};

export default responseHandler;
