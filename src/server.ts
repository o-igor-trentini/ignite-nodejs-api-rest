import fastify from 'fastify'
import { env } from './env'
import { transactions } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app.register(transactions, { prefix: 'transactions' })

app
  .listen({ port: env.HOST_PORT })
  .then(() => console.log('Servidor executando!'))
