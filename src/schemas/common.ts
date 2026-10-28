import { Type } from '@fastify/type-provider-typebox'

export const IdParams = Type.Object({ id: Type.Integer({ minimum: 1, description: 'Identifiant de la ressource' }) })