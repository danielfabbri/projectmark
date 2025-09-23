// src/utils/logger.ts
import winston from "winston";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const NODE_ENV = process.env.NODE_ENV || "development";

const jsonFormat = combine(
  errors({ stack: true }), // include stack trace if error object logged
  timestamp(),
  json()
);

const prettyFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} ${level}: ${message} ${metaStr}`;
  })
);

const transports: winston.transport[] = [];

// Console in dev - pretty print; in prod we keep json for log collectors
if (NODE_ENV === "production") {
  transports.push(new winston.transports.Console({ format: jsonFormat }));
  // You can add file transports in production:
  transports.push(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
  transports.push(new winston.transports.File({ filename: "logs/combined.log" }));
} else {
  transports.push(new winston.transports.Console({ format: prettyFormat }));
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta: { service: "knowledge-base-api", env: NODE_ENV },
  format: NODE_ENV === "production" ? jsonFormat : prettyFormat,
  transports,
});

// Optional: redirect console to logger in dev (helps when libs use console.log)
if (process.env.REPLACE_CONSOLE === "true" || NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log = (...args: any[]) => logger.info(args.map(String).join(" "));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => logger.error(args.map(String).join(" "));
  console.warn = (...args: any[]) => logger.warn(args.map(String).join(" "));
}

export default logger;
