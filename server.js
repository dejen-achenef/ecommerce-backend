import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import router from "./src/routes/index.js";
import { config } from "./src/config/index.js";
import { requestId } from "./src/middleware/requestId.js";
import { notFoundHandler, errorHandler } from "./src/middleware/errorHandler.js";
import { prismaErrorHandler } from "./src/middleware/prismaErrorHandler.js";

const app = express();

// Core middlewares
app.use(requestId);
app.use(morgan(':method :url :status - :response-time ms reqId=:req[id]'));
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), version: "1.0" });
});

// API routes
app.use("/api", router);

// 404 and error handling
app.use(notFoundHandler);
app.use(prismaErrorHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`server listening on port ${config.port}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  // Force exit if not closed in time
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
