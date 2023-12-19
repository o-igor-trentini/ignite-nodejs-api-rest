import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') config({ path: '.env.test' })
else config({ path: '.env' })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DB_URL: z.string(),
  HOST_PORT: z.number().default(3000),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  const err = 'Variáveis de ambiente incorretas'

  console.error(err, _env.error.format())
  throw new Error(err)
}

export const env = _env.data
