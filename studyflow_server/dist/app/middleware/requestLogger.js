"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_config_1 = __importDefault(require("../../config/logger.config"));
/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    // Log request
    logger_config_1.default.info("Incoming request", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
    });
    // Log response
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? "error" : "info";
        logger_config_1.default.log(logLevel, "Request completed", {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });
    next();
};
exports.default = requestLogger;
