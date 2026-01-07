import { NextFunction, Request, Response } from "express";
import logger from "../../config/logger.config";

/**
 * Request logging middleware
 */
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Log request
    logger.info("Incoming request", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
    });

    // Log response
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? "error" : "info";

        logger.log(logLevel, "Request completed", {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
};

export default requestLogger;
