import winston from "winston";
import config from "../config/app.config.js";

const logger = winston.createLogger({
    level: config.env === "development" ? "debug" : "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
};

export default loggerMiddleware;