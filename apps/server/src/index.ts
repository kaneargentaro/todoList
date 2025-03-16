import {serve} from "bun";
import app from "./server";
import logger from './utils/logger';

logger.info('ENV VARIABLES:');
logger.info('===========================');
logger.info(`PORT: ${process.env.PORT}`);
logger.info(`DB_HOST: ${process.env.DB_HOST}`);
logger.info(`DB_PORT: ${process.env.DB_PORT}`);
logger.info(`DB_USER: ${process.env.DB_USER}`);
logger.info(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
logger.info(`DB_NAME: ${process.env.DB_NAME}`);
logger.info(`DB_URL: ${process.env.DB_URL}`);
logger.info('===========================');

const port = Number(process.env.PORT) || 3000;

logger.info(`Server running on port ${port}`);
serve({
    port,
    fetch: app.fetch,
});
