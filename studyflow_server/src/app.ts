import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import requestLogger from "./app/middleware/requestLogger";
import router from "./app/routes";
import logger from "./config/logger.config";

const app: Application = express();

// CORS configuration
app.use(cors());

// Compression middleware
app.use(compression());

// Request logging
app.use(requestLogger);

app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "StudyFlow Backend is running successfully 🚀",
    version: "1.0.0",
    status: "healthy",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.warn("API endpoint not found", {
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

export default app;
