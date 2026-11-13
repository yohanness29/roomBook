import "dotenv/config";
import { bookingRoutes } from "./routes/bookings.ts";
import { roomsRoutes } from "./routes/rooms.ts";
import swagger from "./plugins/swagger.ts";
import errors from "./plugins/errors.ts";
import logger from "./plugins/logger.ts";
import prisma from "./plugins/prisma.ts";
import auth from "./plugins/auth.ts";
import Fastify from "fastify";
import { AuthRoutes } from "./routes/auth.ts";
import security from "./plugins/security.ts";

export const buildApp = () => {
  const app = Fastify({ logger: true });
  app.register(errors);
  app.register(security);
  app.register(prisma);
  app.register(swagger);
  app.register(logger);
  app.register(auth);
  app.get("/", async () => ({}));
  app.get("/health", async () => ({ status: "ok" }));
  app.register(roomsRoutes, { prefix: "/rooms" });
  app.register(bookingRoutes, { prefix: "/bookings" });
  app.register(AuthRoutes, { prefix: "/auth" });
  return app;
};
