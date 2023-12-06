import fastify from 'fastify'

const app = fastify()

app.get('/', () => {
  return 'Hello world!'
})

app.listen({ port: 3000 }).then(() => console.log('Servidor executando!'))
