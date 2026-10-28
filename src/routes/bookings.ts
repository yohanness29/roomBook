import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify/types/plugin.js";
import { Booking, BookingBody, BookingBodyType, BookingType } from "../schemas/booking.ts";
import { Type } from 'typebox'

type Booking = { id: number, roomId: number, userId: number, startAt: string, endsAt: string }

let bookings: Booking[] = [
    {id: 1, roomId: 1, userId: 1, startAt: "2024-06-01T10:00:00", endsAt: "2024-06-01T12:00:00"}
]
let nextId = 2

export const bookingRoutes: FastifyPluginAsync = async(app) =>{
    const typed = app.withTypeProvider<TypeBoxTypeProvider>()
        typed.get('/', { schema: { 
                            querystring: Type.Object({
                                minCapacity: Type.Optional(Type.Integer({minimum:1}))},
                                {additionalProperties: false}) 
                            }}, async(request, reply)=> {
            const {minCapacity} = request.query
            // if(minCapacity) return bookings.filter((b)=>b.capacity >= minCapacity )
            return bookings
        })
        typed.get('/:id', { schema: {
                                response: {
                                    200: Booking, 
                                    404: Type.Object({error: Type.String()})
                                }, 
                                params: Type.Object({ id: Type.String({minLength: 1})})
                            }}, async(request, reply) =>{
            const { id } = request.params
            const booking = bookings.find((b) => b.id === Number(id))
            if (!booking) { return reply.status(404).send({ error: "booking not found" }) }
            return booking
        })
        typed.post('/', {schema: {
                            body: BookingBody 
                        }}, async(request, reply) =>{
            const booking: BookingType = {id: nextId, ...request.body } 
            bookings.push(booking)
            nextId++
            return reply.code(201).send(booking)
        })
        typed.patch('/:id', {schema: {
                                params: Type.Object({id: Type.String({minLength: 1})}), 
                                body: Type.Partial(BookingBody, { minProperties: 1}),
                                response: {
                                    200: Booking,
                                    404: Type.Object({error: Type.String()})
                                }
                            }}, async(request, reply) =>{
            const booking = bookings.find((b)=> b.id === Number(request.params.id))
            if(!booking) return reply.code(404).send({error: "Booking not found"})
            Object.assign(booking, request.body)
            return booking
        })
        app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
            const booking = bookings.find((b)=> b.id === Number(request.params.id))
            if(!booking) return reply.code(404).send({Error: "Booking not found"})
            bookings = bookings.filter((r) => r.id !== booking.id)
            return reply.code(200).send({message: "Booking Deleted"})
        })
}