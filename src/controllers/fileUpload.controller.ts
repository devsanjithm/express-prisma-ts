import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { s3CreateObject } from '../config/fileUpload.aws';
import ApiError from '../utils/ApiError';
import { v4 as uuidv4 } from 'uuid';

const fileUpload = catchAsync(async (req, res) => {
  if (req.files?.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Image need to be selected');
  const results = await s3CreateObject(req.files, `${uuidv4()}`);
  return res.send({ imageurl: results });
});

export default {
  fileUpload
};
