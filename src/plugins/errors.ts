import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { FastifyError } from 'fastify'
import fp from 'fastify-plugin'
export default fp(async(app)=>{
    const prismaError = {
        P2002: { statusCode: 409, error: "Conflict", message: "Cette valeur existe déjà" },
        P2003: { statusCode: 409, error: "Conflict", message: "Cette ressource est référencée ailleurs" },
        P2025: { statusCode: 404, error: "Not Found", message: "Ressource introuvable" }
    }
    app.setErrorHandler((e: FastifyError, request, reply)=>{
        if(e.validation || e.statusCode && e.statusCode < 500){ return reply.send(e) }
        if(e instanceof PrismaClientKnownRequestError && e.code in prismaError){
          const {statusCode, ...rest} = prismaError[e.code as keyof typeof prismaError]
          return reply.code(statusCode).send({statusCode, ...rest})
        }
        request.log.error(e)
        reply.status(500).send({ statusCode: 500, error: 'Internal server error', message: 'Erreur interne' })
    })
})
export class HttpError extends Error {
    constructor(public statusCode: number, message: string){ 
        super(message) 
    }
}