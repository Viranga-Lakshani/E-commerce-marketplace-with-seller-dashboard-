import Fastify from "fastify";
import cors from "fastify-cors";
import pino from "pino";
import dotenv from "dotenv";
import authPlugin from "./lib/auth";
import productRoutes from "./routes/products";
import sellerRoutes from "./routes/sellers";
import shopRoutes from "./routes/shop";
import orderRoutes from "./routes/orders";
import prisma from "./lib/prisma";

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = Fastify({ logger });

app.register(cors, { origin: true, credentials: true });

app.register(authPlugin);

app.register(productRoutes, { prefix: "/api/products" });
app.register(sellerRoutes, { prefix: "/api/sellers" });
app.register(shopRoutes, { prefix: "/api" });
app.register(orderRoutes, { prefix: "/api/orders" });

app.get("/health", async () => ({ status: "ok", now: new Date().toISOString() }));

// Graceful shutdown
const start = async () => {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    app.log.info(`Server listening on ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

// Handle process shutdown: disconnect prisma
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
