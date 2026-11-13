import { bookingRoutes } from "./routes/bookings.ts";
import { roomsRoutes } from "./routes/rooms.ts";
import swagger from "./plugins/swagger.ts";
import errors from "./plugins/errors.ts";
import logger from "./plugins/logger.ts";
import prisma from "./plugins/prisma.ts";
import Fastify from "fastify";

export const buildApp = () => {
    const app = Fastify({logger: true})
    app.register(errors)
    app.register(prisma)
    app.register(swagger)
    app.register(logger)
    app.get('/', async()=>({}))
    app.get('/health', async() => ({ status: 'ok' }))
    app.register(roomsRoutes, { prefix: '/rooms' });
    app.register(bookingRoutes, { prefix: '/bookings' })
    return app;
}