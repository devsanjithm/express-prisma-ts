import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../docs/swagger_output.json' assert { type: 'json' };

const router = express.Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default router;
