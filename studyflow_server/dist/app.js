"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const requestLogger_1 = __importDefault(require("./app/middleware/requestLogger"));
const routes_1 = __importDefault(require("./app/routes"));
const logger_config_1 = __importDefault(require("./config/logger.config"));
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)());
// Compression middleware
app.use((0, compression_1.default)());
// Request logging
app.use(requestLogger_1.default);
app.use((0, cookie_parser_1.default)());
// Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({
        Message: "StudyFlow Backend is running successfully 🚀",
        version: "1.0.0",
        status: "healthy",
    });
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use((req, res, next) => {
    logger_config_1.default.warn("API endpoint not found", {
        path: req.originalUrl,
        method: req.method,
    });
    res.status(404).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
