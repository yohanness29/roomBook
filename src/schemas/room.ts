import { Type, Static } from "@fastify/type-provider-typebox";

const SCHEMA_ID = "Room";
export const RoomBody = Type.Object(
  {
    name: Type.String({
      minLength: 1,
      description: "Nom de la salle",
      examples: ["Salle Turing"],
    }),
    capacity: Type.Integer({
      minimum: 1,
      description: "Nombre de places de la salle",
      examples: [12],
    }),
  },
  { examples: [{ name: "Salle Turing", capacity: 12 }] },
);
export type RoomBodyType = Static<typeof RoomBody>;
export const Room = Type.Object(
  {
    id: Type.Integer({
      description: "Identifiant unique de la salle",
      examples: [1],
    }),
    name: Type.String({
      description: "Nom de la salle",
      examples: ["Salle Turing"],
    }),
    capacity: Type.Integer({
      description: "Nombre de places de la salle",
      examples: [12],
    }),
  },
  { $id: SCHEMA_ID, examples: [{ id: 1, name: "Salle Turing", capacity: 12 }] },
);
export type RoomType = Static<typeof Room>;
export const RoomRef = Type.Unsafe<RoomType>(Type.Ref(SCHEMA_ID));
export const RoomParams = Type.Object({
  id: Type.Integer({
    description: "Identifiant unique de la salle",
    examples: [1],
  }),
});
export type RoomParamsType = Static<typeof RoomParams>;
