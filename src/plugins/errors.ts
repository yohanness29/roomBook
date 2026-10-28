import { FastifyError } from 'fastify'
import fp from 'fastify-plugin'
export default fp(async(app)=>{
    app.setErrorHandler((e: FastifyError, request, reply)=>{
        if(e.validation || e.statusCode && e.statusCode < 500){ return reply.send(e) }
        request.log.error(e)
        reply.status(500).send({ statusCode: 500, error: 'Internal server error', message: 'Erreur interne' })
    })
})

export class HttpError extends Error {
    constructor(public statusCode: number, message: string){ 
        super(message) 
    }
}