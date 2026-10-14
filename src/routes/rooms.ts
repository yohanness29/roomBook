import { FastifyPluginAsync } from "fastify/types/plugin.js";

type Room = { id: number ; name: string ; capacity: number }

const rooms: Room[] = [
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
    app.get('/', async() => rooms)
    app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const room = rooms.find((r) => r.id === Number(request.params.id))
        if (!room) { return reply.status(404).send({ error: "Room not found" }) }
        return room
    })
    app.post<{ Body: { name: string ; capacity: number } }>('/', async (request, reply) => {
        const room: Room = { id: nextId, ...request.body} 
        rooms.push(room)
        nextId++;
        return reply.code(201).send(room)
    })
}