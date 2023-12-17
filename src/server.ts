import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async () => {
  return await knex('sqlite_schema').select('*')
})

app.listen({ port: 3000 }).then(() => console.log('Servidor executando!'))
