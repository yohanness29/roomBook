import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify/types/plugin.js";
import { Room, RoomBody, RoomType } from "../schema/room.ts";
import { Type } from 'typebox'
import { httpError } from "../plugins/errors.ts";

type Room = { id: number ; name: string ; capacity: number }

let rooms: Room[] = [
    { id: 1, name: "A101", capacity: 30 },
    { id: 2, name: "B202", capacity: 12 },
    { id: 3, name: "C303", capacity: 54 },
    { id: 4, name: "D404", capacity: 68 },
    { id: 5, name: "E505", capacity: 37 },
    { id: 6, name: "F606", capacity: 94 },
    { id: 7, name: "G727", capacity: 46 }
]
let nextId = 8

const roomPatchWhitelist= ['name', 'capacity']

export const roomsRoutes: FastifyPluginAsync = async (app) => {
    const typed = app.withTypeProvider<TypeBoxTypeProvider>()
    typed.get('/', { schema: { 
                        querystring: Type.Object({
                            minCapacity: Type.Optional(Type.Integer({minimum:1}))},
                            {additionalProperties: false}) 
                        }}, async(request, reply)=> {
        const {minCapacity} = request.query
        if(minCapacity) return rooms.filter((r)=>r.capacity >= minCapacity )
        return rooms
    })
    typed.get('/:id', { schema: {
                            response: {
                                200: Room, 
                                404: Type.Object({error: Type.String()})
                            }, 
                            params: Type.Object({ id: Type.String({minLength: 1})})
                        }}, async(request, reply) =>{
        const { id } = request.params
        const room = rooms.find((r) => r.id === Number(id))
        if (!room) { throw new httpError(404, "Room not found") }
        return room
    })
    typed.post('/', {schema: {
                        body: RoomBody 
                    }}, async(request, reply) =>{
        const room: RoomType = {id: nextId, ...request.body } 
        rooms.push(room)
        nextId++
        return reply.code(201).send(room)
    })
    typed.patch('/:id', {schema: {
                            params: Type.Object({id: Type.String({minLength: 1})}), 
                            body: Type.Partial(RoomBody, { minProperties: 1}),
                            response: {
                                200: Room,
                                404: Type.Object({error: Type.String()})
                            }
                        }}, async(request, reply) =>{
        const room = rooms.find((r)=> r.id === Number(request.params.id))
        if(!room) throw new httpError(404, "Room not found")
        Object.assign(room, request.body)
        return room
    })
    app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const room = rooms.find((r)=> r.id === Number(request.params.id))
        if(!room) throw new httpError(404,'Room not found')
        rooms = rooms.filter((r) => r.id !== room.id)
        return reply.code(200).send({message: "Room Deleted"})
    })
}