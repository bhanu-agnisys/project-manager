const express = require("express");
const { envList } = require("../utils/envUtils");
const apiRouter = require("./routes");

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }

    next();
  });

  app.use((req, res, next) => {
    const startedAt = Date.now();

    res.on("finish", () => {
      const durationMs = Date.now() - startedAt;
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`
      );
    });

    next();
  });

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      environment: envList.NODE_ENV,
      uptime: Math.floor(process.uptime()),
    });
  });

  app.use("/api", apiRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use((err, req, res, next) => {
    console.error("Request failed", {
      method: req.method,
      url: req.originalUrl,
      message: err.message,
    });

    if (res.headersSent) {
      next(err);
      return;
    }

    const statusCode =
      Number.isInteger(err.statusCode) && err.statusCode >= 400
        ? err.statusCode
        : 500;

    res.status(statusCode).json({
      error: statusCode >= 500 ? "Internal server error" : err.message,
    });
  });

  return app;
}

module.exports = { createApp };
