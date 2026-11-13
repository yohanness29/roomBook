import { Type, Static } from "@fastify/type-provider-typebox";
import { Room, RoomRef, RoomType } from "./room.ts";

export const BookingBody = Type.Object(
  {
    roomId: Type.Integer({ minimum: 1, description: "Identifiant de la salle réservée", examples: [1]}),
    userId: Type.Integer({ minimum: 1, description: "Identifiant de l'utilisateur qui réserve", examples: [42]}),
    startsAt: Type.String({ format: "date-time", description: "Début de la réservation (ISO 8601)", examples: ["2026-11-12T09:00:00.000Z"]}),
    endsAt: Type.String({format: "date-time", description: "Fin de la réservation (ISO 8601), postérieure au début", examples: ["2026-11-12T10:00:00.000Z"]}),
  }, { examples: [ { roomId: 1, userId: 42, startsAt: "2026-11-12T09:00:00.000Z", endsAt: "2026-11-12T10:00:00.000Z"}]},
);
export type BookingBodyType = Static<typeof BookingBody>;
export const Booking = Type.Object({ 
    id: Type.Integer({ description: "Identifiant unique de la réservation", examples: [7]}),
    roomId: Type.Integer({ description: "Identifiant de la salle réservée", examples: [1]}),
    userId: Type.Integer({ description: "Identifiant de l'utilisateur qui réserve", examples: [42]}),
    startsAt: Type.Unsafe<Date>({ type: "string", description: "Début de la réservation (ISO 8601)", examples: ["2026-11-12T09:00:00.000Z"], format: "date-time"}),
    endsAt: Type.Unsafe<Date>({ type: "string", description: "Fin de la réservation (ISO 8601)", examples: ["2026-11-12T10:00:00.000Z"], format: "date-time"}),
  },{ $id: "Booking", examples: [{ id: 7, roomId: 1, userId: 42, startsAt: "2026-11-12T09:00:00.000Z", endsAt: "2026-11-12T10:00:00.000Z" }]},
);
export const BookingWithRoom = Type.Object({ ...Booking.properties, room: RoomRef },{ $id: "BookingWithRoom" },);
export type BookingType = Static<typeof Booking>;
export const BookingRef = Type.Unsafe<BookingType>(Type.Ref("Booking"));
export type BookingWithRoom = Static<typeof BookingWithRoom>;
export const BookingWithRoomRef = Type.Unsafe<BookingWithRoom>(Type.Ref("BookingWithRoom"));
export const BookingParams = Type.Object({ id: Type.Integer({ description: "Identifiant unique de la salle",examples: [1]}),});
export type BookingParamsType = Static<typeof BookingParams>;