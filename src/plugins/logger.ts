import fp from 'fastify-plugin'
export default fp(async(app)=>{
    app.addHook('onRequest', async(r)=>{
        r.log.info('toutes les routes')
    })
})