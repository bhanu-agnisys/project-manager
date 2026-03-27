const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

function getRequiredEnvValue(...keys) {
  for (const key of keys) {
    const value = process.env[key];

    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  throw new Error(`Missing required environment variable: ${keys.join(" or ")}`);
}

function parsePort(value) {
  if (value === undefined || value === "") {
    return 3000;
  }

  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
}

function parseNodeEnv(value) {
  const nodeEnv = (value || "development").trim().toLowerCase();
  const allowedValues = new Set(["development", "test", "production"]);

  if (!allowedValues.has(nodeEnv)) {
    throw new Error(
      "NODE_ENV must be one of: development, test, production"
    );
  }

  return nodeEnv;
}

function envParser() {
  return Object.freeze({
    PORT: parsePort(process.env.PORT),
    NODE_ENV: parseNodeEnv(process.env.NODE_ENV || process.env.MODE),
    MONGOURL: getRequiredEnvValue("MONGOURL", "MONGO_URL"),
    JWT_SECRET: process.env.JWT_SECRET || "project-manager-dev-secret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  });
}

const envList = envParser();

module.exports = { envList };
