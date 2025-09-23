import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  logger.error("uncaughtException", { message: err?.message, stack: err?.stack });
  process.exit(1); // em produção, prefira terminar e reiniciar (supervisor)
});

process.on("unhandledRejection", (reason) => {
  logger.error("unhandledRejection", { reason });
});
