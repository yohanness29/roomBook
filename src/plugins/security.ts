import fp from "fastify-plugin";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
export default fp(async (app) => {
  await app.register(helmet);
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
  await app.register(cors, { origin: ["http://localhost:8080"] });
});
