import Fastify from "fastify";
import { roomsRoutes } from "./routes/rooms.ts";
import { bookingRoutes } from "./routes/bookings.ts";
import logger from "./plugins/logger.ts";
import errors from "./plugins/errors.ts";
import swagger from "./plugins/swagger.ts";

export const buildApp = () => {
    const app = Fastify({logger: true})
    app.register(swagger)
    app.register(logger)
    app.register(errors)
    app.get('/health', async() => ({ status: 'ok' }))
    app.register(roomsRoutes, { prefix: '/rooms' });
    app.register(bookingRoutes, { prefix: '/bookings' })
    return app;
}