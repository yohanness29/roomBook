import { TypeBoxTypeProvider, Type } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify/types/plugin.js";
import { Room, RoomBody, RoomType } from "../schemas/room.ts";
import { HttpError } from "../plugins/errors.ts";
import { rooms } from "../data/store.ts";
import { IdParams } from "../schemas/common.ts";

let nextId = 8

export const roomsRoutes: FastifyPluginAsync = async (app) => {
  const typed = app.withTypeProvider<TypeBoxTypeProvider>()
  typed.get('/', { schema: { 
    tags: ['rooms'],
    summary: 'Liste des salles',
    querystring: Type.Object({
      minCapacity: Type.Optional(Type.Integer({minimum:1}))
    }, {additionalProperties: false}), 
    response: { 200: Type.Array(Room) }
  }}, async(request, )=> {
    const {minCapacity} = request.query
    if(minCapacity) return rooms.filter((r)=>r.capacity >= minCapacity )
    return rooms
  })
  typed.get('/:id', { schema: {
    tags: ['rooms'],
    summary: "Recherche d'une salle",
    response: { 200: Room }, 
    params: IdParams
  }}, async(request, reply) =>{
    const { id } = request.params
    const room = rooms.find((r) => r.id === id)
    if (!room) { throw new HttpError(404, "Room not found") }
    return room
  })
  typed.post('/', {schema: {
    tags: ['rooms'],
    summary: "Ajouter une salle",
    body: RoomBody,
    response: { 201: Room }
  }}, async(request, reply) =>{
    const room: RoomType = {id: nextId, ...request.body } 
    rooms.push(room)
    nextId++
    return reply.code(201).send(room)
  })
  typed.patch('/:id', {schema: {
    tags: ['rooms'],
    summary: "modifier une salle",
    params: IdParams, 
    body: Type.Partial(RoomBody, { minProperties: 1, additionalProperties: false}),
       response: { 200: Room }
  }}, async(request, reply) =>{
    const room = rooms.find((r)=> r.id === request.params.id)
    if(!room) throw new HttpError(404, "Room not found")
    Object.assign(room, request.body)
    return room
  })
  typed.delete('/:id', { schema: {
    tags: ['rooms'],
    summary: "supprimer une salle",
    params: IdParams, 
    response: { 204: Type.Null() }
  }}, async (request, reply) => {
    const i = rooms.findIndex((r) => r.id === request.params.id)
    if (i === -1) throw new HttpError(404, 'Room not found')
    rooms.splice(i, 1)
    return reply.code(204).send(null)
  })
}