import type { RoomType } from '../schemas/room.ts'
import type { BookingType } from '../schemas/booking.ts'

export const rooms: RoomType[] = [
    { id: 1, name: "A101", capacity: 30 },
    { id: 2, name: "B202", capacity: 12 },
    { id: 3, name: "C303", capacity: 54 },
    { id: 4, name: "D404", capacity: 68 },
    { id: 5, name: "E505", capacity: 37 },
    { id: 6, name: "F606", capacity: 94 },
    { id: 7, name: "G727", capacity: 46 }
]
export const bookings: BookingType[] = [
    { id: 1, roomId: 1, userId: 1, startsAt: '2024-06-01T10:00:00Z', endsAt: '2024-06-01T12:00:00Z' }
]
