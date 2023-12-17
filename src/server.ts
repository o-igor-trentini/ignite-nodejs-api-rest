import fastify from 'fastify'
import { knex } from './database'
import * as crypto from 'crypto'
import { env } from './env'

const app = fastify()

app.get('/', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de teste',
      amount: 100,
    })
    .returning('*')

  return transaction
})

app
  .listen({ port: env.HOST_PORT })
  .then(() => console.log('Servidor executando!'))
