import { Type, Static } from "@fastify/type-provider-typebox";

export const BookingBody = Type.Object({
    roomId: Type.Integer({ minimum: 1, description: 'Identifiant de la salle réservée', examples: [1] }),
    userId: Type.Integer({ minimum: 1, description: "Identifiant de l'utilisateur", examples: [1] }),
    startsAt: Type.String({ format: 'date-time', description: 'Début du créneau', examples: ['2026-11-01T10:00:00Z'] }),
    endsAt: Type.String({ format: 'date-time', description: 'Fin du créneau, après le début', examples: ['2026-11-01T12:00:00Z'] })
}, { additionalProperties: false })
export type BookingBodyType = Static<typeof BookingBody>


export const Booking = Type.Object({
    id: Type.Integer(),
    roomId: Type.Integer(),
    userId: Type.Integer(),
    startsAt: Type.String(),
    endsAt: Type.String()
})
export type BookingType = Static<typeof Booking>