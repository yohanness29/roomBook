import { Type, Static } from "@fastify/type-provider-typebox";

export const RoomBody = Type.Object({
    name: Type.String({minLength: 1, description: "nom de la salle", examples: ['A101']}),
    capacity: Type.Integer({minimum: 1, description: "nombre de places", examples: [10]})
}, {additionalProperties: false })
export type RoomBodyType = Static<typeof RoomBody>

export const Room = Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    capacity: Type.Integer()
})
export type RoomType = Static<typeof Room>

