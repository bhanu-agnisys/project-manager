const express = require("express");
const { envList } = require("./utils/envUtils");
const {
  connectToDb,
  disconnectFromDb,
} = require("./services/db/connectDb");

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

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
    return next(err);
  }

  const statusCode =
    Number.isInteger(err.statusCode) && err.statusCode >= 400
      ? err.statusCode
      : 500;

  res.status(statusCode).json({
    error: statusCode >= 500 ? "Internal server error" : err.message,
  });
});

let server;
let isShuttingDown = false;

async function shutdown(signal, error) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  if (error) {
    console.error(`${signal} received`, error);
  } else {
    console.log(`${signal} received. Shutting down gracefully...`);
  }

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((closeError) => {
          if (closeError) {
            reject(closeError);
            return;
          }

          resolve();
        });
      });
    }

    await disconnectFromDb();
    process.exit(error ? 1 : 0);
  } catch (shutdownError) {
    console.error("Shutdown failed", shutdownError);
    process.exit(1);
  }
}

async function startServer() {
  await connectToDb();

  server = app.listen(envList.PORT, () => {
    console.log(
      `Server is running on port ${envList.PORT} in ${envList.NODE_ENV} mode`
    );
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("uncaughtException", (error) => {
  void shutdown("uncaughtException", error);
});

process.on("unhandledRejection", (reason) => {
  const error =
    reason instanceof Error ? reason : new Error(`Unhandled rejection: ${reason}`);

  void shutdown("unhandledRejection", error);
});

startServer().catch((error) => {
  console.error("Application failed to start", error);
  process.exit(1);
});

module.exports = { app };
