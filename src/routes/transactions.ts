import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import crypto from 'crypto'
import { z } from 'zod'

export const transactions = async (app: FastifyInstance) => {
  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })

  app.get('/:id', async (req: FastifyRequest) => {
    const schema = z.object({
      id: z.string().uuid(),
    })

    const { id } = schema.parse(req.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  app.post('/', async (req: FastifyRequest, res: FastifyReply) => {
    const schema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = schema.parse(req.body)

    knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    res.status(201).send()
  })
}
