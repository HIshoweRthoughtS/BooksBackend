import { Logger } from "../services/logger.service.js";

export function initLogger(req, res, next) {
        const logger = Logger.getLogger();
        console.log('\n', new Date(), ' - ', 'Request Received');
        logger.add(`Path: ${req.path}`, 2, 'request');
        logger.add(`Query: ${req.query}`, 2, 'request');

        res.on('finish', () => Logger.getLogger().print());

        next();
    }
