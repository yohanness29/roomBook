import { TypeBoxTypeProvider, Type } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify/types/plugin.js";
import { Booking, BookingBody } from "../schemas/booking.ts";
import { IdParams } from "../schemas/common.ts";
import { HttpError } from "../plugins/errors.ts";

export const bookingRoutes: FastifyPluginAsync = async (app) => {
  const {prisma} = app
  const typed = app.withTypeProvider<TypeBoxTypeProvider>();
  typed.get("/",{schema: {
      tags: ['bookings'], summary: "liste des réservations",
      response: { 200: Type.Array(Booking) },
      querystring: Type.Object({ roomId: Type.Optional(Type.Integer({ minimum: 1 }))}, { additionalProperties: false })
    }}, async (request) => {
      return prisma.booking.findMany({where: {roomId: request.query.roomId}, include: {room: true}, orderBy: {startsAt:'asc'}})
    },
  );
  typed.get("/:id",{ schema: {
      tags: ['bookings'], summary: "rechercher une réservation",
      params: IdParams, response: { 200: Booking },
    }}, async (request) => {
      const booking = await prisma.booking.findUnique({where: {id: request.params.id}})
      if (!booking) throw new HttpError(404, "Booking not found")
      return booking
    },
  );
  typed.post("/", { schema: { 
    tags: ['bookings'], summary: "ajouter une réservation",
    body: BookingBody, response: { 201: Booking }
  }}, async (request, reply) => {
    const { roomId, startsAt, endsAt } = request.body
    if (new Date(endsAt) <= new Date(startsAt)) throw new HttpError(400, 'endsAt must be after startsAt')
    const booking = await prisma.$transaction(async(tx) => {
      const conflict = await tx.booking.findFirst({where: {roomId, startsAt: {lt: new Date(endsAt)}, endsAt: {gt: new Date(startsAt)}}})
      if(conflict) throw new HttpError(409, "Créneau déjà réservé")
      return tx.booking.create({data: request.body})
    })
    return reply.code(201).send(booking)
  });
  typed.patch("/:id",{ schema: {
    tags: ['bookings'], summary: "modifier une réservation", params: IdParams,
    body: Type.Partial(BookingBody, { minProperties: 1, additionalProperties: false }), response: { 200: Booking }
  }}, async (request) => {
    return prisma.$transaction(async(tx) => {
      const booking = await tx.booking.findUnique({where: {id: request.params.id}})
      if (!booking) throw new HttpError(404, "Booking not found")
      const roomId = request.body.roomId ?? booking.roomId
      const startsAt = request.body.startsAt ? new Date(request.body.startsAt) : booking.startsAt
      const endsAt = request.body.endsAt ? new Date(request.body.endsAt) : booking.endsAt
      if (endsAt <= startsAt) throw new HttpError(400, 'endsAt must be after startsAt')
      const conflict = await tx.booking.findFirst({where: {roomId, id: {not: booking.id}, startsAt: {lt: endsAt}, endsAt: {gt: startsAt}}})
      if (conflict) throw new HttpError(409, "Créneau déjà réservé")
      return tx.booking.update({where: {id: request.params.id}, data: {roomId, startsAt, endsAt, userId: request.body.userId}})
    })
  });
  typed.delete("/:id", { schema: { 
    tags: ['bookings'],
    summary: "supprimer une réservation",
    params: IdParams,
    response: { 204: Type.Null() }
  }}, async (request, reply) => {
    await prisma.booking.delete({where: {id: request.params.id}})
    return reply.code(204).send(null)
  });
};