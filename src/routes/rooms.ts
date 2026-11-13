import { TypeBoxTypeProvider, Type } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify/types/plugin.js";
import { Room, RoomBody } from "../schemas/room.ts";
import { HttpError } from "../plugins/errors.ts";
import { IdParams } from "../schemas/common.ts";

export const roomsRoutes: FastifyPluginAsync = async (app) => {
  const typed = app.withTypeProvider<TypeBoxTypeProvider>()
  const { prisma } = app
  typed.get('/', { schema: { 
    tags: ['rooms'],
    summary: 'Liste des salles',
    querystring: Type.Object({
      minCapacity: Type.Optional(Type.Integer({minimum:1}))
    }, {additionalProperties: false}), 
    response: { 200: Type.Array(Room) }
  }}, async(request)=> {
    return prisma.room.findMany({where: { capacity: { gte: request.query.minCapacity}}})
  })
  typed.get('/:id', { schema: {
    tags: ['rooms'],
    summary: "Recherche d'une salle",
    response: { 200: Room }, 
    params: IdParams
  }}, async(request) =>{
    const room = await prisma.room.findUnique({ where: { id: Number(request.params.id)}})
    if (!room) throw new HttpError(404, 'salle introuvable')
    return room
  })
  typed.post('/', {schema: {
    tags: ['rooms'],
    summary: "Ajouter une salle",
    body: RoomBody,
    response: { 201: Room }
  }}, async(request, reply) =>{
    const room = await prisma.room.create({data: request.body})
    return reply.code(201).send(room)
  })
  typed.patch('/:id', {schema: {
    tags: ['rooms'],
    summary: "modifier une salle",
    params: IdParams, 
    body: Type.Partial(RoomBody, { minProperties: 1, additionalProperties: false}),
       response: { 200: Room }
  }}, async(request) =>{
    return await prisma.room.update({data: request.body, where: {id: request.params.id}})
  })
  typed.delete('/:id', { schema: {
    tags: ['rooms'],
    summary: "supprimer une salle",
    params: IdParams, 
    response: { 204: Type.Null() }
  }}, async (request, reply) => {
    const room = await prisma.room.findUnique({where: {id: Number(request.params.id)}})
    if (!room) throw new HttpError(404, 'Room not found')
    await prisma.room.delete({where: {id: request.params.id}})
    return reply.code(204).send(null)
  })
}