import { TypeBoxTypeProvider, Type } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify/types/plugin.js";
import { Booking, BookingBody, BookingType } from "../schemas/booking.ts";
import { IdParams } from "../schemas/common.ts";
import { HttpError } from "../plugins/errors.ts";
import { rooms, bookings } from "../data/store.ts";

let nextId = 2;

export const bookingRoutes: FastifyPluginAsync = async (app) => {
  const typed = app.withTypeProvider<TypeBoxTypeProvider>();
  typed.get("/",{
      schema: {
        querystring: Type.Object(
          { roomId: Type.Optional(Type.Integer({ minimum: 1 }))}, { additionalProperties: false },
        ),
        response: { 200: Type.Array(Booking) }
      },
    },
    async (request, reply) => {
      const { roomId } = request.query;
      if (roomId) return bookings.filter((b) => b.roomId === roomId);
      return bookings;
    },
  );
  typed.get("/:id",{
      schema: {
        params: IdParams,
        response: {
          200: Booking,
        },
      },
    },
    async (request) => {
      const { id } = request.params;
      const booking = bookings.find((b) => b.id === id);
      if (!booking) { throw new HttpError(404, "Booking not found"); }
      return booking;
    },
  );
  typed.post("/", { schema: { 
      body: BookingBody, 
      response: { 201: Booking }
    }},
    async (request, reply) => {
      const { roomId, startsAt, endsAt } = request.body
      if (new Date(endsAt) <= new Date(startsAt)) throw new HttpError(400, 'endsAt must be after startsAt')
      if (!rooms.some((r)=>r.id === roomId)) throw new HttpError(400, 'Room not found')
      const booking: BookingType = { id: nextId, ...request.body };
      bookings.push(booking);
      nextId++;
      return reply.code(201).send(booking);
    },
  );
  typed.patch("/:id",{ schema: {
      params: IdParams,
      body: Type.Partial(BookingBody, { minProperties: 1, additionalProperties: false }),
      response: { 200: Booking }
    }},
    async (request) => {
      const booking = bookings.find((b) => b.id === request.params.id);
      if (!booking) throw new HttpError(404, "Booking not found");
      const updated = { ...booking, ...request.body }
      if (new Date(updated.endsAt) <= new Date(updated.startsAt)) throw new HttpError(400, 'endsAt must be after startsAt')
      if (!rooms.some((r) => r.id === updated.roomId)) throw new HttpError(400, 'Room not found')
      Object.assign(booking, request.body);
      return booking;
    },
  );
  typed.delete("/:id", { schema: { params: IdParams }}, async (request, reply) => {
    const i = bookings.findIndex((b) => b.id === request.params.id);
    if (i === -1) throw new HttpError(404, "Booking not found");
    bookings.splice(i, 1)
    return reply.code(204).send();
  });
};
