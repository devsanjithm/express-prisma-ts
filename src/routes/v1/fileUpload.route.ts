import express from 'express';
import validate from '../../middlewares/validate';
import { fileUploadController } from '../../controllers';
import auth from '../../middlewares/auth';
import { fileUploadValidation } from '../../validations';
const router = express.Router();

router.post(
  '/upload-file',
  auth('uploadFile'),
  validate(fileUploadValidation.fileUpload),
  fileUploadController.fileUpload
);

export default router;

/**
 * @swagger
 * tags:
 *   name: File
 *   description: File Upload
 */

/**
 * @swagger
 * /upload-file:
 *   post:
 *     summary: Used to file upload
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: File
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: File
 *                 format : file
 *                 description : required field to upload a file
 *             example:
 *               file : Array<buffer>
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageURL'
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
