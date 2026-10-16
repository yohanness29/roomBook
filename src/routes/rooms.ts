import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify/types/plugin.js";
import { Room, RoomBody, RoomType } from "../schema/room.ts";

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

export const roomsRoutes: FastifyPluginAsync = async (app) => {
    const typed = app.withTypeProvider<TypeBoxTypeProvider>()
    typed.post('/', {schema: { body: RoomBody,/* response: Room*/ }}, async(request, reply) =>{
        const room: RoomType = {id: nextId, ...request.body } 
        rooms.push(room)
        nextId++
        return reply.code(201).send(room)
    })
    app.get('/', async() => rooms)
    app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const room = rooms.find((r) => r.id === Number(request.params.id))
        if (!room) { return reply.status(404).send({ error: "Room not found" }) }
        return room
    })
    // app.post<{ Body: { name: string ; capacity: number } }>('/', async (request, reply) => {
    //     const room: Room = { id: nextId, ...request.body} 
    //     rooms.push(room)
    //     nextId++
    //     return reply.code(201).send(room)
    // })
    app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const room = rooms.find((r)=> r.id === Number(request.params.id))
        if(!room) return reply.code(404).send({Error: "Room not found"})
        rooms = rooms.filter((r) => r.id !== room.id)
        return reply.code(200).send({message: "Room Deleted"})
    })
}