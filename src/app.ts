import Fastify from "fastify";
import { roomsRoutes } from "./routes/rooms.ts";
import { bookingRoutes } from "./routes/booking.ts";

export const buildApp = () => {
    const app = Fastify({logger: true})
    app.get('/health', async() => ({ status: 'ok' }))
    app.register(roomsRoutes, { prefix: '/rooms' });
    app.register(bookingRoutes, { prefix: '/bookings' })
    return app;
}