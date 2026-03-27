const { envList } = require("./utils/envUtils");
const {
  connectToDb,
  disconnectFromDb,
} = require("./services/db/connectDb");
const { createApp } = require("./src/app");

const app = createApp();

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
