import 'dotenv/config'
import { Knex, knex as setupKnex } from 'knex'
import { env } from './env'

const conn =
  env.DB_CLIENT === 'sqlite'
    ? {
        filename: env.DB_URL,
      }
    : env.DB_URL

export const config: Knex.Config = {
  client: env.DB_CLIENT,
  connection: conn,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
