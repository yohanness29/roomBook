import { Type, Static } from "@fastify/type-provider-typebox";

export const BookingBody = Type.Object({
    roomId: Type.Integer(),
    userId: Type.Integer(),
    startAt: Type.String(),
    endsAt: Type.String()
})
export type BookingBodyType = Static<typeof BookingBody>


export const Booking = Type.Object({
    id: Type.Integer(),
    roomId: Type.Integer(),
    userId: Type.Integer(),
    startAt: Type.String(),
    endsAt: Type.String()
})
export type BookingType = Static<typeof Booking>