import { env } from './env'
import { app } from './app'

app
  .listen({ port: env.HOST_PORT })
  .then(() => console.log('Servidor executando!'))
